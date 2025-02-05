import { useState, useEffect } from 'react';
import { NFTCard } from '../components/NFTCard';
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';

export const Explore = () => {
    const [nfts, setNfts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNFTs = async () => {
            try {
                const connection = new Connection(clusterApiUrl('devnet'));
                const allNFTs = await connection.getParsedProgramAccounts(
                    new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
                    {
                        filters: [
                            {
                                dataSize: 165
                            },
                            {
                                memcmp: {
                                    offset: 32,
                                    bytes: new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s').toBase58()
                                }
                            }
                        ]
                    }
                );

                const nftData = await Promise.all(
                    allNFTs.map(async (nft) => {
                        const accountInfo = await connection.getParsedAccountInfo(nft.pubkey);
                        return {
                            id: nft.pubkey.toString(),
                            name: accountInfo.value?.data?.parsed?.info?.name || 'Unnamed NFT',
                            description: accountInfo.value?.data?.parsed?.info?.symbol || '',
                            image: accountInfo.value?.data?.parsed?.info?.uri || '',
                            price: 0
                        };
                    })
                );

                setNfts(nftData);
            } catch (error) {
                console.error('Error fetching NFTs:', error);
                setNfts([]); // Set empty array on error
            } finally {
                setLoading(false);
            }
        };

        fetchNFTs();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {nfts.map((nft) => (
                <NFTCard key={nft.id} nft={nft} />
            ))}
        </div>
    );
};