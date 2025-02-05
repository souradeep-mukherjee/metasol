import { useWallet } from '@solana/wallet-adapter-react';

export const NFTCard = ({ nft }) => {
    const { publicKey } = useWallet();

    const handlePurchase = async (nft) => {
        if (!publicKey) {
            alert('Please connect your wallet first');
            return;
        }
        // Add purchase logic here
    try {
        const connection = new Connection(clusterApiUrl('devnet'));
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey: new PublicKey(nft.seller),
                lamports: LAMPORTS_PER_SOL * nft.price
            })
        );
        
        const signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [window.solana]
        );
        
        console.log('Transaction completed:', signature);
        alert('Purchase successful!');
    } catch (error) {
        console.error('Transaction failed:', error);
        alert('Purchase failed. Please try again.');
    }
    };

    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
            <div className="p-4">
                {nft.image && (
                    <img 
                        src={nft.image} 
                        alt={nft.name} 
                        className="w-full h-48 object-cover rounded"
                    />
                )}
                <div className="mt-4">
                    <h3 className="font-bold text-xl mb-2">{nft.name}</h3>
                    <p className="text-gray-700 text-base mb-4">{nft.description}</p>
                    <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-primary">
                            {nft.price} SOL
                        </span>
                        <button
                            onClick={() => handlePurchase(nft)}
                            className="bg-secondary-light hover:bg-secondary-dark text-white px-4 py-2 rounded transition duration-300"
                            disabled={!publicKey}
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};