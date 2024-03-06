import { useState } from 'react';
import {
  deleteTransactionToast,
  removeAllSignedTransactions,
  removeAllTransactionsToSign
} from '@multiversx/sdk-dapp/services/transactions/clearTransactions';
import { refreshAccount, sendTransactions } from 'helpers';
import { useTrackTransactionStatus } from 'hooks/sdkDappHooks';

export const useSendPingPongTransaction = (type: any) => {
  // Needed in order to differentiate widgets between each other
  // By default sdk-dapp takes the last sessionId available which will display on every widget the same transaction
  // this usually appears on page refreshes
  const [pingPongSessionId, setPingPongSessionId] = useState(
    sessionStorage.getItem(type)
  );

  const transactionStatus = useTrackTransactionStatus({
    transactionId: pingPongSessionId ?? '0'
  });

  const clearAllTransactions = () => {
    removeAllSignedTransactions();
    removeAllTransactionsToSign();
    deleteTransactionToast(pingPongSessionId ?? '');
  };

  const sendTransaction = async (contractAddress?: string, method?: string, amount?: string) => {
    clearAllTransactions();

    const pingTransaction = {
      value: amount,
      data: method,
      receiver: contractAddress,
      gasLimit: '60000000'
    };

    await refreshAccount();
    const { sessionId } = await sendTransactions({
      transactions: pingTransaction,
      transactionsDisplayInfo: {
        processingMessage: 'Processing Ping transaction',
        errorMessage: 'An error has occured during Ping',
        successMessage: 'Ping transaction successful'
      },
      redirectAfterSign: false
    });

    sessionStorage.setItem(type, sessionId);
    setPingPongSessionId(sessionId);

    console.log("eagle type = ", type)
    console.log("eagle pingTransaction = ", pingTransaction)
    console.log("eagle sessionId = ", sessionId)

  };

  return {
    sendTransaction,
    transactionStatus
  };
};
