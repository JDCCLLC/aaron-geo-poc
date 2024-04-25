import { calculateBoundingBox } from "./calculate-bounding-box.util";
import { findLocationsWithinRadius } from "./find-locations-within-radius.util";
import { PocLocation } from "./types";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";

export const docClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

process.env.AWS_PROFILE = 'aaron-whellness'
process.env.AWS_REGION = 'us-west-2'
const TABLE_NAME = `sheff-temp-table-poc`

const main = async () => {
  console.log(`main starting...`)

  // generate query input
  let queryInput: QueryCommandInput = {
    TableName: TABLE_NAME,
    KeyConditionExpression: `#pk = :pk`,
    ExpressionAttributeValues: {
      ':pk': 'location'
    },
    ExpressionAttributeNames: {
      '#pk': 'pk'
    }
  }
  const sdkResp = await docClient.send(new QueryCommand(queryInput))

  const locations: PocLocation[] = []
  for (const item of sdkResp.Items || []) {
    locations.push(JSON.parse(JSON.stringify(item)))
  }

  const centerLat = 34.0522; // Latitude for Los Angeles
  const centerLng = -118.2437; // Longitude for Los Angeles
  const radius = 100; // 100 miles radius

  const boundingBox = calculateBoundingBox(
    {
      latitude: centerLat,
      longitude: centerLng,
    },
    10
  )
  console.log(`boundingBox: `, boundingBox)

  const locationsInsideBox: PocLocation[] = []
  for (const location of locations) {
    if (location.latitude <= boundingBox.nw.latitude) {
      if (location.latitude >= boundingBox.se.latitude) {
        if (location.longitude <= boundingBox.se.longitude) {
          if (location.longitude >= boundingBox.nw.longitude) {
            locationsInsideBox.push(location)
          }
        }
      }
    }
  }
  console.log("locationsInsideBox: ")
  console.log(locationsInsideBox)


  const locationsWithinRadius = findLocationsWithinRadius(locations, centerLat, centerLng, radius);
  console.log("locationsWithinRadius: ")
  console.log(locationsWithinRadius); // This will log all locations within 100 miles of Los Angeles

  console.log(`main ending...`)
}

main().then(() => { })