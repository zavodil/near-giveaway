import 'regenerator-runtime/runtime'

const contract = require('./rest-api-test-utils');
const utils = require('./utils');
const helper = require('./helper');

const alice = "nfticket.testnet";
const bob = "place.testnet";
const carol = "lr.testnet";
const admin = "grant.testnet";

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

describe("Create events", () => {
    test("Event Id check", async () => {
        const current_event_id = await near.view("get_next_event_id");
        const event_id = await near.call("add_event", {
            event_input: {
                rewards: [
                    utils.ConvertToNear(reward_3)
                    ],
                rewards_token_id: null,
                participants: [
                    alice,
                    bob,
                    carol],
                allow_duplicate_participants: false,
                add_participants_start_timestamp: start_timestamp,
                add_participants_end_timestamp: end_timestamp,
                event_timestamp: event_timestamp,
                title: "Test",
                description: "Test text"
            }
        }, {
            account_id: admin,
            deposit_near: reward_1 + reward_2 + service_fee,
            return_value: true
        });
        expect(event_id).toBe(current_event_id);
        const next_event_id = await near.view("get_next_event_id");
        expect(parseInt(next_event_id)).toBe(parseInt(event_id) + 1);
    });

    test("Finalize event twice", async () => {
        const event_id = await near.call("add_event", {
            event_input: {
                rewards: [
                    utils.ConvertToNear(reward_3)
                ],
                rewards_token_id: null,
                participants: [
                    alice,
                    bob,
                    carol],
                allow_duplicate_participants: false,
                add_participants_start_timestamp: start_timestamp,
                add_participants_end_timestamp: end_timestamp,
                event_timestamp: event_timestamp,
                title: "Test",
                description: "Test text"
            }
        }, {
            account_id: admin,
            deposit_near: reward_3 + service_fee,
            return_value: true
        });

        const finalize_event_1 = await near.call("finalize_event", {
            event_id: parseInt(event_id)
        }, {account_id: admin});
        expect(finalize_event_1.type).not.toBe('FunctionCallError');

        const finalize_event_2 = await near.call("finalize_event", {
            event_id: parseInt(event_id)
        }, {account_id: admin, log_errors: false});
        expect(finalize_event_2.type).toBe('FunctionCallError');
    });

    test("Close event", async () => {
        const event_id = await near.call("add_event", {
            event_input: {
                rewards: [
                    utils.ConvertToNear(reward_3)
                ],
                rewards_token_id: null,
                participants: [
                    alice,
                    bob,
                    carol],
                allow_duplicate_participants: false,
                add_participants_start_timestamp: start_timestamp,
                add_participants_end_timestamp: end_timestamp,
                event_timestamp: event_timestamp,
                title: "Test",
                description: "Test text"
            }
        }, {
            account_id: admin,
            deposit_near: reward_3 + service_fee,
            return_value: true
        });

        const event_0 = await near.view("get_event",
            {event_id: parseInt(event_id)}, {parse_json: true});
        expect(event_0.status).toBe('Pending');

        const close_event_1 = await near.call("close_event", {
            event_id: parseInt(event_id)
        }, {account_id: admin, log_errors: false});
        expect(close_event_1.type).toBe('FunctionCallError');

        const event_1 = await near.view("get_event",
            {event_id: parseInt(event_id)}, {parse_json: true});
        expect(event_1.status).toBe('Pending');

        const finalize_event = await near.call("finalize_event", {
            event_id: parseInt(event_id)
        }, {account_id: admin});
        expect(finalize_event.type).not.toBe('FunctionCallError');

        const close_event_2 = await near.call("close_event", {
            event_id: parseInt(event_id)
        }, {account_id: admin, log_errors: false});
        expect(close_event_2.type).toBe('FunctionCallError');

        const event_2 = await near.view("get_event",
            {event_id: parseInt(event_id)}, {parse_json: true});
        expect(event_2.status).toBe('Calculated');

        const distribute_payouts = await near.call("distribute_payouts", {
            event_id: parseInt(event_id)
        }, {account_id: admin});
        expect(distribute_payouts.type).not.toBe('FunctionCallError');

        const event_3 = await near.view("get_event",
            {event_id: parseInt(event_id)}, {parse_json: true});
        expect(event_3.status).toBe('Calculated');

        const close_event_3 = await near.call("close_event", {
            event_id: parseInt(event_id)
        }, {account_id: admin});
        expect(close_event_3.type).not.toBe('FunctionCallError');

        const event_4 = await near.view("get_event",
            {event_id: parseInt(event_id)}, {parse_json: true});
        expect(event_4.status).toBe('Distributed');
    });

    test("2 participants, 2 rewards", async () => {
        const event_id = await near.call("add_event", {
            event_input: {
                rewards: [
                    utils.ConvertToNear(reward_1),
                    utils.ConvertToNear(reward_2)
                ],
                rewards_token_id: null,
                participants: [
                    alice,
                    bob],
                allow_duplicate_participants: false,
                add_participants_start_timestamp: start_timestamp,
                add_participants_end_timestamp: end_timestamp,
                event_timestamp: event_timestamp,
                title: "Test",
                description: "Test text"
            }
        }, {
            account_id: admin,
            deposit_near: reward_1 + reward_2 + service_fee,
            return_value: true
        });

        // finalize, check reward
        const alice_wallet_balance_1 = await near.accountNearBalance(alice);
        const bob_wallet_balance_1 = await near.accountNearBalance(bob);

        const finalize_event = await near.call("finalize_event", {
            event_id: parseInt(event_id)
        }, {account_id: admin});
        expect(finalize_event.type).not.toBe('FunctionCallError');

        const distribute_payouts = await near.call("distribute_payouts", {
            event_id: parseInt(event_id)
        }, {account_id: admin});
        expect(distribute_payouts.type).not.toBe('FunctionCallError');

        const alice_wallet_balance_2 = await near.accountNearBalance(alice);
        const bob_wallet_balance_2 = await near.accountNearBalance(bob);

        expect(alice_wallet_balance_2).toBeGreaterThan(alice_wallet_balance_1);
        expect(bob_wallet_balance_2).toBeGreaterThan(bob_wallet_balance_1);

        expect(compareArrays(
            [reward_1, reward_2],
            [alice_wallet_balance_2 - alice_wallet_balance_1,
                bob_wallet_balance_2 - bob_wallet_balance_1
            ]))
            .toBeTruthy();
    });

    test("3 participants, 2 rewards", async () => {
        const event_id = await near.call("add_event", {
            event_input: {
                rewards: [
                    utils.ConvertToNear(reward_1),
                    utils.ConvertToNear(reward_2)
                ],
                rewards_token_id: null,
                participants: [
                    alice,
                    bob,
                    carol],
                allow_duplicate_participants: false,
                add_participants_start_timestamp: start_timestamp,
                add_participants_end_timestamp: end_timestamp,
                event_timestamp: event_timestamp,
                title: "Test",
                description: "Test text"
            }
        }, {
            account_id: admin,
            deposit_near: reward_1 + reward_2 + service_fee,
            return_value: true
        });

        // finalize, check reward
        const alice_wallet_balance_1 = await near.accountNearBalance(alice);
        const bob_wallet_balance_1 = await near.accountNearBalance(bob);
        const carol_wallet_balance_1 = await near.accountNearBalance(carol);

        const finalize_event = await near.call("finalize_event", {
            event_id: parseInt(event_id)
        }, {account_id: admin});
        expect(finalize_event.type).not.toBe('FunctionCallError');

        const distribute_payouts = await near.call("distribute_payouts", {
            event_id: parseInt(event_id)
        }, {account_id: admin});
        expect(distribute_payouts.type).not.toBe('FunctionCallError');

        const alice_wallet_balance_2 = await near.accountNearBalance(alice);
        const bob_wallet_balance_2 = await near.accountNearBalance(bob);
        const carol_wallet_balance_2 = await near.accountNearBalance(carol);

        expect(compareArrays(
            [reward_1, reward_2, 0],
            [alice_wallet_balance_2 - alice_wallet_balance_1,
                bob_wallet_balance_2 - bob_wallet_balance_1,
                carol_wallet_balance_2 - carol_wallet_balance_1
            ]))
            .toBeTruthy();
    });

    test("1 participant, 2 rewards", async () => {
        const event_id = await near.call("add_event", {
            event_input: {
                rewards: [
                    utils.ConvertToNear(reward_1),
                    utils.ConvertToNear(reward_2)
                ],
                rewards_token_id: null,
                participants: [
                    alice
                ],
                allow_duplicate_participants: false,
                add_participants_start_timestamp: start_timestamp,
                add_participants_end_timestamp: end_timestamp,
                event_timestamp: event_timestamp,
                title: "Test",
                description: "Test text"
            }
        }, {
            account_id: admin,
            deposit_near: reward_1 + reward_2 + service_fee,
            return_value: true
        });

        // finalize, check reward
        const alice_wallet_balance_1 = await near.accountNearBalance(alice);

        const finalize_event = await near.call("finalize_event", {
            event_id: parseInt(event_id)
        }, {account_id: admin});
        expect(finalize_event.type).not.toBe('FunctionCallError');

        const distribute_payouts = await near.call("distribute_payouts", {
            event_id: parseInt(event_id)
        }, {account_id: admin});
        expect(distribute_payouts.type).not.toBe('FunctionCallError');

        const alice_wallet_balance_2 = await near.accountNearBalance(alice);

        expect(compareArrays(
            [reward_1],
            [alice_wallet_balance_2 - alice_wallet_balance_1]))
            .toBeTruthy();
    });
});

function compareArrays(a1, a2){
    a1 = a1.map(i => parseFloat(i).toFixed(5));
    a2 = a2.map(i => parseFloat(i).toFixed(5));

    a1 = JSON.stringify(a1.sort());
    a2 = JSON.stringify(a2.sort());
    let result = a1 === a2;
    if(!result) {
        console.log(`CompareArrays: false: ${a1} / ${a2}`);
    }
    return result;
}
