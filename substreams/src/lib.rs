mod abi;
mod pb;
use hex_literal::hex;
use pb::contract::v1 as contract;
use substreams::Hex;
use substreams_database_change::pb::database::DatabaseChanges;
use substreams_database_change::tables::Tables as DatabaseChangeTables;
use substreams_entity_change::pb::entity::EntityChanges;
use substreams_entity_change::tables::Tables as EntityChangesTables;
use substreams_ethereum::pb::eth::v2 as eth;
use substreams_ethereum::Event;

#[allow(unused_imports)]
use num_traits::cast::ToPrimitive;
use std::str::FromStr;
use substreams::scalar::BigDecimal;

const TRACKED_CONTRACT: [u8; 20] = hex!("56ee7f1a5525c4fc789e44dd27bb925b38c189e1");

substreams_ethereum::init!();

#[substreams::handlers::map]
fn map_events(blk: eth::Block) -> Result<contract::Events, substreams::errors::Error> {
    Ok(contract::Events {
        model_account_createds: blk
            .receipts()
            .flat_map(|view| {
                view.receipt.logs.iter()
                    .filter(|log| log.address == TRACKED_CONTRACT)
                    .filter_map(|log| {
                        if let Some(event) = abi::contract::events::ModelAccountCreated::match_and_decode(log) {
                            return Some(contract::ModelAccountCreated {
                                evt_tx_hash: Hex(&view.transaction.hash).to_string(),
                                evt_index: log.block_index,
                                evt_block_time: Some(blk.timestamp().to_owned()),
                                evt_block_number: blk.number,
                                model_id: event.model_id.to_string(),
                                tba: event.tba,
                            });
                        }

                        None
                })
            })
            .collect(),
        model_listed_for_sales: blk
            .receipts()
            .flat_map(|view| {
                view.receipt.logs.iter()
                    .filter(|log| log.address == TRACKED_CONTRACT)
                    .filter_map(|log| {
                        if let Some(event) = abi::contract::events::ModelListedForSale::match_and_decode(log) {
                            return Some(contract::ModelListedForSale {
                                evt_tx_hash: Hex(&view.transaction.hash).to_string(),
                                evt_index: log.block_index,
                                evt_block_time: Some(blk.timestamp().to_owned()),
                                evt_block_number: blk.number,
                                model_id: event.model_id.to_string(),
                                price: event.price.to_string(),
                                tba: event.tba,
                            });
                        }

                        None
                })
            })
            .collect(),
        model_purchaseds: blk
            .receipts()
            .flat_map(|view| {
                view.receipt.logs.iter()
                    .filter(|log| log.address == TRACKED_CONTRACT)
                    .filter_map(|log| {
                        if let Some(event) = abi::contract::events::ModelPurchased::match_and_decode(log) {
                            return Some(contract::ModelPurchased {
                                evt_tx_hash: Hex(&view.transaction.hash).to_string(),
                                evt_index: log.block_index,
                                evt_block_time: Some(blk.timestamp().to_owned()),
                                evt_block_number: blk.number,
                                model_id: event.model_id.to_string(),
                                new_owner: event.new_owner,
                                tba: event.tba,
                            });
                        }

                        None
                })
            })
            .collect(),
    })
}

#[substreams::handlers::map]
fn db_out(events: contract::Events) -> Result<DatabaseChanges, substreams::errors::Error> {
    // Initialize changes container
    let mut tables = DatabaseChangeTables::new();

    // Loop over all the abis events to create changes
    events.model_account_createds.into_iter().for_each(|evt| {
        tables
            .create_row("model_account_created", [("evt_tx_hash", evt.evt_tx_hash),("evt_index", evt.evt_index.to_string())])
            .set("evt_block_time", evt.evt_block_time.unwrap())
            .set("evt_block_number", evt.evt_block_number)
            .set("model_id", BigDecimal::from_str(&evt.model_id).unwrap())
            .set("tba", Hex(&evt.tba).to_string());
    });
    events.model_listed_for_sales.into_iter().for_each(|evt| {
        tables
            .create_row("model_listed_for_sale", [("evt_tx_hash", evt.evt_tx_hash),("evt_index", evt.evt_index.to_string())])
            .set("evt_block_time", evt.evt_block_time.unwrap())
            .set("evt_block_number", evt.evt_block_number)
            .set("model_id", BigDecimal::from_str(&evt.model_id).unwrap())
            .set("price", BigDecimal::from_str(&evt.price).unwrap())
            .set("tba", Hex(&evt.tba).to_string());
    });
    events.model_purchaseds.into_iter().for_each(|evt| {
        tables
            .create_row("model_purchased", [("evt_tx_hash", evt.evt_tx_hash),("evt_index", evt.evt_index.to_string())])
            .set("evt_block_time", evt.evt_block_time.unwrap())
            .set("evt_block_number", evt.evt_block_number)
            .set("model_id", BigDecimal::from_str(&evt.model_id).unwrap())
            .set("new_owner", Hex(&evt.new_owner).to_string())
            .set("tba", Hex(&evt.tba).to_string());
    });

    Ok(tables.to_database_changes())
}

#[substreams::handlers::map]
fn graph_out(events: contract::Events) -> Result<EntityChanges, substreams::errors::Error> {
    // Initialize changes container
    let mut tables = EntityChangesTables::new();

    // Loop over all the abis events to create changes
    events.model_account_createds.into_iter().for_each(|evt| {
        tables
            .create_row("model_account_created", format!("{}-{}", evt.evt_tx_hash, evt.evt_index))
            .set("evt_tx_hash", evt.evt_tx_hash)
            .set("evt_index", evt.evt_index)
            .set("evt_block_time", evt.evt_block_time.unwrap())
            .set("evt_block_number", evt.evt_block_number)
            .set("model_id", BigDecimal::from_str(&evt.model_id).unwrap())
            .set("tba", Hex(&evt.tba).to_string());
    });
    events.model_listed_for_sales.into_iter().for_each(|evt| {
        tables
            .create_row("model_listed_for_sale", format!("{}-{}", evt.evt_tx_hash, evt.evt_index))
            .set("evt_tx_hash", evt.evt_tx_hash)
            .set("evt_index", evt.evt_index)
            .set("evt_block_time", evt.evt_block_time.unwrap())
            .set("evt_block_number", evt.evt_block_number)
            .set("model_id", BigDecimal::from_str(&evt.model_id).unwrap())
            .set("price", BigDecimal::from_str(&evt.price).unwrap())
            .set("tba", Hex(&evt.tba).to_string());
    });
    events.model_purchaseds.into_iter().for_each(|evt| {
        tables
            .create_row("model_purchased", format!("{}-{}", evt.evt_tx_hash, evt.evt_index))
            .set("evt_tx_hash", evt.evt_tx_hash)
            .set("evt_index", evt.evt_index)
            .set("evt_block_time", evt.evt_block_time.unwrap())
            .set("evt_block_number", evt.evt_block_number)
            .set("model_id", BigDecimal::from_str(&evt.model_id).unwrap())
            .set("new_owner", Hex(&evt.new_owner).to_string())
            .set("tba", Hex(&evt.tba).to_string());
    });

    Ok(tables.to_entity_changes())
}
