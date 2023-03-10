import { Injectable } from '@nestjs/common';
require('dotenv').config();
const REGION: string = "ap-northeast-1";

const { DynamoDBClient, ScanCommand, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { fromIni } = require("@aws-sdk/credential-providers");

var client = new DynamoDBClient({ 
    region: REGION, 
    credentials: fromIni({ profile: process.env.AWS_PROFILE 
  })
});

var params = {
  TableName: 'snacks',
  // credentials: fromIni({ profile: process.env.AWS_PROFILE })
};

interface ScannedData {
  $metadata: object
  Count: number
  Items: object[]
  ScannedCount: number
}

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getItems(): Promise<object[]> {
    var res: ScannedData = await client.send(new ScanCommand(params));
    return res.Items
  }

  async postItem(snack_name: string) {

    var response: object = {}
    try {
      const command = new PutItemCommand({
        TableName: 'snacks',
        Item: {
          name: { S: snack_name },
        },
      });
      response = await client.send(command);
      return response;

    } catch (err) {
      console.log(err);
    }

    return response;
  }
}
