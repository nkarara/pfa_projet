import React, { createContext, useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';

const Web3Context = createContext();

export const useWeb3 = () => {
    const context = useContext(Web3Context);
    if (!context) {
        throw new Error('useWeb3 must be used within Web3Provider');
    }
    return context;
};

export const Web3Provider = ({ children }) => {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [account, setAccount] = useState(null);
    const [chainId, setChainId] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        checkIfWalletIsConnected();

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                window.ethereum.removeListener('chainChanged', handleChainChanged);
            }
        };
    }, []);

    const checkIfWalletIsConnected = async () => {
        try {
            if (!window.ethereum) {
                console.log('MetaMask not detected');
                return;
            }

            const provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await provider.listAccounts();

            if (accounts.length > 0) {
                const signer = await provider.getSigner();
                const address = await signer.getAddress();
                const network = await provider.getNetwork();

                setProvider(provider);
                setSigner(signer);
                setAccount(address);
                setChainId(Number(network.chainId));
                setIsConnected(true);
            }
        } catch (error) {
            console.error('Error checking wallet connection:', error);
        }
    };

    const connectWallet = async () => {
        try {
            if (!window.ethereum) {
                toast.error('Please install MetaMask!');
                return { success: false, message: 'MetaMask not installed' };
            }

            const provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send('eth_requestAccounts', []);

            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            const network = await provider.getNetwork();

            setProvider(provider);
            setSigner(signer);
            setAccount(address);
            setChainId(Number(network.chainId));
            setIsConnected(true);

            toast.success('Wallet connected successfully!');
            return { success: true, address };
        } catch (error) {
            console.error('Error connecting wallet:', error);
            toast.error('Failed to connect wallet');
            return { success: false, message: error.message };
        }
    };

    const disconnectWallet = () => {
        setProvider(null);
        setSigner(null);
        setAccount(null);
        setChainId(null);
        setIsConnected(false);
        toast.info('Wallet disconnected');
    };

    const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
            disconnectWallet();
        } else {
            setAccount(accounts[0]);
            toast.info('Account changed');
        }
    };

    const handleChainChanged = () => {
        window.location.reload();
    };

    const getContract = (address, abi) => {
        if (!signer) {
            throw new Error('Wallet not connected');
        }
        return new ethers.Contract(address, abi, signer);
    };

    const sendTransaction = async (to, value) => {
        try {
            if (!signer) {
                throw new Error('Wallet not connected');
            }

            const tx = await signer.sendTransaction({
                to,
                value: ethers.parseEther(value.toString())
            });

            toast.info('Transaction sent. Waiting for confirmation...');
            const receipt = await tx.wait();
            toast.success('Transaction confirmed!');

            return { success: true, receipt };
        } catch (error) {
            console.error('Transaction error:', error);
            toast.error('Transaction failed');
            return { success: false, error: error.message };
        }
    };

    const value = {
        provider,
        signer,
        account,
        chainId,
        isConnected,
        connectWallet,
        disconnectWallet,
        getContract,
        sendTransaction
    };

    return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};
