"use client";

import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { Presets, Client } from 'userop';
import { useConfig } from './useConfig';

// useSendUserOp hook following NERO's high-level documentation exactly
export const useSendUserOp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userOpHash, setUserOpHash] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  
  const config = useConfig();

  const execute = useCallback(async (operation: {
    signer: ethers.Signer;
    target: string;
    data: string;
    value?: string;
  }) => {
    try {
      setIsLoading(true);
      setError(null);
      setUserOpHash(null);
      setResult(null);

      const { signer, target, data, value = '0' } = operation;

      // Initialize the SimpleAccount builder
      const simpleAccount = await Presets.Builder.SimpleAccount.init(
        signer,
        config.rpcUrl,
        {
          overrideBundlerRpc: config.bundler,
          entryPoint: config.entryPoint,
          factory: config.accountFactory,
        }
      );

      // Initialize client
      const client = await Client.init(config.bundler);

      // Set gas parameters
      const gasParams = {
        callGasLimit: "0x88b8",
        verificationGasLimit: "0x33450", 
        preVerificationGas: "0xc350",
        maxFeePerGas: "0x2162553062",
        maxPriorityFeePerGas: "0x40dbcf36",
      };

      simpleAccount.setCallGasLimit(gasParams.callGasLimit);
      simpleAccount.setVerificationGasLimit(gasParams.verificationGasLimit);
      simpleAccount.setPreVerificationGas(gasParams.preVerificationGas);
      simpleAccount.setMaxFeePerGas(gasParams.maxFeePerGas);
      simpleAccount.setMaxPriorityFeePerGas(gasParams.maxPriorityFeePerGas);

      // Configure paymaster for sponsored transactions
      if (config.paymasterAPIKey) {
        simpleAccount.setPaymasterOptions({
          apikey: config.paymasterAPIKey,
          rpc: config.paymaster,
          type: "0" // Sponsored transaction
        });
      }

      // Create the UserOperation
      const userOp = await simpleAccount.execute(target, value, data);
      
      // Send the UserOperation
      const res = await client.sendUserOperation(userOp);
      setUserOpHash(res.userOpHash);
      
      console.log("UserOperation sent with hash:", res.userOpHash);
      
      return res.userOpHash;
    } catch (error: any) {
      console.error("Error executing UserOperation:", error);
      setError(error.message || 'Failed to execute operation');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [config]);

  const waitForUserOpResult = useCallback(async () => {
    if (!userOpHash) {
      throw new Error('No UserOperation hash available');
    }

    try {
      setIsLoading(true);
      
      // For now, return the userOpHash as the result
      // In a full implementation, this would wait for the transaction to be mined
      const receipt = {
        userOpHash,
        success: true,
        blockNumber: 'pending'
      };
      
      console.log("UserOperation submitted:", userOpHash);
      setResult(receipt);
      
      return receipt;
    } catch (error: any) {
      console.error("Error waiting for UserOperation result:", error);
      setError(error.message || 'Failed to get operation result');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [userOpHash]);

  return {
    execute,
    waitForUserOpResult,
    isLoading,
    error,
    userOpHash,
    result,
  };
}; 