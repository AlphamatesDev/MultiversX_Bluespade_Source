import { useState, useEffect } from 'react';
import axios from 'axios';
import BigNumber from 'bignumber.js';
// import { PingPongResponseType } from '../types';

type PingPongResponseType = {
  code: string;
  data: {
    data: {
      returnData: string[];
      returnCode: string;
      returnMessage: string;
      gasRemaining: number;
      gasRefund: number;
      outputAccounts: {
        [key: string]: {
          address: string;
          nonce: number;
          balance: null | number;
          balanceDelta: number;
          storageUpdates: { [key: string]: any };
          code: null | number;
          codeMetaData: null | number;
          outputTransfers: [];
          callType: number;
        };
      };
      deletedAccounts: [];
      touchedAccounts: [];
      logs: [];
    };
  };
  error: string;
};

const decodeAmount = (data: PingPongResponseType) => {
  const returnValue = data.data.data.returnData[0];
  const decodedString = Buffer.from(returnValue, 'base64').toString('hex');

  return new BigNumber(decodedString, 16).toString(10);
};

export const useGetContractValue = (network: any, address: string, method: string, args: any[]) => {
  const [pingAmount, setPingAmount] = useState<string>();


  const getValueFromContract = async () => {
    try {
      const { data } = await axios.post<PingPongResponseType>(
        `${network.apiAddress}/vm-values/query`,
        {
          scAddress: address,
          funcName: method,
          args: args
        }
      );

      const amount = decodeAmount(data);
      setPingAmount(amount);
    } catch (err) {
      console.error('Unable to call getValueFromContract - RAW', err);
    }
  };

  useEffect(() => {
    getValueFromContract();
  }, []);

  return pingAmount;
};
