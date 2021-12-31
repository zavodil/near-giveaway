import 'regenerator-runtime/runtime'

const contract = require('./rest-api-test-utils');
const utils = require('./utils');
const helper = require('./helper');

const alice = "grant.testnet";
const bob = "place.testnet";
const admin = "zavodil.testnet";

const start_timestamp = helper.GetNanosec(new Date().getTime() - 24 * 60 * 60 * 1000);
const end_timestamp = helper.GetNanosec(new Date().getTime() + 24 * 60 * 60 * 1000);
const event_timestamp = helper.GetNanosec(new Date().getTime() + 1 * 1000);
const reward_1 = 0.3;
const reward_2 = 0.2;
const reward_3 = 0.1;
const service_fee = 0.01;


const contract_id = process.env.CONTRACT_NAME;
const near = new contract(contract_id);

describe("Contract set", () => {
    test("Contract is not null " + helper.GetContractUrl(), async () => {
        expect(contract_id).not.toBe(undefined)
    });

    test("Init contract", async () => {
        await near.call("new", {
            owner_id: "zavodil.testnet",
            multisender_contract: "dev-1611689128537-1966413"
        }, {account_id: contract_id});
    });

    test('Accounts has enough funds', async () => {
        const alice_wallet_balance = await near.accountNearBalance(alice);
        expect(alice_wallet_balance).toBeGreaterThan(20);

        const bob_wallet_balance = await near.accountNearBalance(bob);
        expect(bob_wallet_balance).toBeGreaterThan(20);
    });
});

describe("Create event", () => {
    let event_id;
    test("New event", async () => {
        const current_event_id = await near.view("get_next_event_id");
        event_id = await near.call("add_event", {
            event_input: {
                rewards: [utils.ConvertToNear(reward_1), utils.ConvertToNear(reward_2)],
                rewards_token_id: null,
                participants: [alice, bob],
                allow_duplicate_participants: false,
                add_participants_start_timestamp: start_timestamp,
                add_participants_end_timestamp: end_timestamp,
                event_timestamp: event_timestamp,
                title: "Test",
                description: "Test text"
            }
        }, {
            account_id: admin,
            tokens: utils.ConvertToNear(reward_1 + reward_2 + service_fee),
            return_value: true
        });
        expect(event_id).toBe(current_event_id);
        const next_event_id = await near.view("get_next_event_id");
        expect(parseInt(next_event_id)).toBe(parseInt(event_id) + 1);
    });

    test("Finalize event", async () => {
        const alice_wallet_balance_1 = await near.accountNearBalance(alice);
        const bob_wallet_balance_1 = await near.accountNearBalance(bob);

        const finalize_event = await near.call("finalize_event", {
            event_id: parseInt(event_id)
        }, {account_id: admin});
        expect(finalize_event.type).not.toBe('FunctionCallError');

        const distribute_payouts = await near.call("distribute_payouts", {
            event_id: parseInt(event_id),
            from_index: 0,
            limit: 2
        }, {account_id: admin});
        expect(distribute_payouts.type).not.toBe('FunctionCallError');

        const alice_wallet_balance_2 = await near.accountNearBalance(alice);
        const bob_wallet_balance_2 = await near.accountNearBalance(bob);

        expect(alice_wallet_balance_2).toBeGreaterThan(alice_wallet_balance_1);
        expect(bob_wallet_balance_2).toBeGreaterThan(bob_wallet_balance_1);
    });


});
