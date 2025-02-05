import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, clusterApiUrl } from '@solana/web3.js';

export const CreateNFTForm = () => {
    const { publicKey, signTransaction } = useWallet();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        image: null,
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, image: file });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!publicKey) {
            alert('Please connect your wallet first!');
            return;
        }

        try {
            // Upload image to Arweave
            const imageFile = formData.image;
            if (!imageFile) throw new Error('No image file selected');

            // Create Metaplex instance
            const metaplex = new Metaplex(connection)
                .use(walletAdapterIdentity(useWallet()))
                .use(bundlrStorage());

            // Upload image and get URI
            const imageUri = await metaplex
                .storage()
                .upload(imageFile);

            // Create metadata
            const { nft } = await metaplex
                .nfts()
                .create({
                    name: formData.name,
                    description: formData.description,
                    sellerFeeBasisPoints: 500, // 5% royalty
                    uri: imageUri,
                    price: Number(formData.price),
                });

            console.log('NFT created:', nft.address.toString());
            const connection = new Connection(clusterApiUrl('devnet'));
            console.log('Creating NFT with data:', formData);
            // Add minting logic
        // Construct NFT data
        const nftData = {
            token: nft,
            owner: publicKey,
            amount: 1, // Minting 1 token
            network: 'devnet'
        };

        // Mint NFT
        const mintTx = await metaplex.nfts().mint({
            nftOrSft: nft,
            toOwner: publicKey,
        });

        // Confirm transaction
        const confirmation = await connection.confirmTransaction(mintTx.response);
        if (confirmation.value.err) throw new Error('Error confirming transaction');

        alert('NFT minted successfully!');
        } catch (error) {
            console.error('Error creating NFT:', error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700">
                            NFT Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            rows={4}
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700">
                            Price (SOL)
                        </label>
                        <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                            step="0.01"
                            min="0"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700">
                            Upload Image
                        </label>
                        <input
                            type="file"
                            onChange={handleImageChange}
                            accept="image/*"
                            className="mt-1 block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-indigo-50 file:text-indigo-700
                                hover:file:bg-indigo-100"
                            required
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Create NFT
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};