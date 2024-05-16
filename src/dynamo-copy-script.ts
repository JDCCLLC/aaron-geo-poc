import { calculateBoundingBox } from "./calculate-bounding-box.util";
import { findLocationsWithinRadius } from "./find-locations-within-radius.util";
import { PocLocation } from "./types";
import { DynamoDBClient, PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommandInput, QueryCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';

process.env.AWS_PROFILE = 'aaron-whellness'
process.env.AWS_REGION = 'us-west-2'
const sourceTableName = `Whelleness_prod_ProviderLocations`
const sourceTableRegion = 'us-west-2'
const targetTableName = `whelleness-backend-single-table-v2-dev`
const targetTableRegion = `us-east-2`

const sourceDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({
    region: sourceTableRegion
}));

const targetDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({
    region: targetTableRegion
}));

const main = async () => {
  console.log(`main starting...`)

  const sdkResp = await sourceDocClient.send(new ScanCommand({
    TableName: sourceTableName
  }))

//   console.log(`sdkResp: `)
//   console.log(sdkResp)

  const newItems: any[] = []
  for (const x of sdkResp.Items || []) {
    let newItem = JSON.parse(JSON.stringify(x))
    newItem.pk = {'S': 'provider_location'}
    newItem.sk = {'S': uuidv4()}
    newItem.latitude = {'N': newItem.geoJson.S.split(',')[0]}
    newItem.longitude = {'N': newItem.geoJson.S.split(',')[1]}
    newItems.push(newItem)
  }

  console.log(`newItems.length: ${newItems.length}`)
  console.log(newItems[0])

  let count = 0
  for (const newItem of newItems) {
    await targetDocClient.send(new PutItemCommand({
        TableName: targetTableName,
        Item: newItem
    }))
    count += 1
    console.log(`count: ${count}`)

    // NBMVRHKPLOJUYTKKKMNBBBBCCC :lynnlee-heart

  }

  

  console.log(`main ending...`)
}

main().then(() => { })