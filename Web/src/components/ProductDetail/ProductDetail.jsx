import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

const ProductDetail = () => {
    const {productId} = useParams();
    const [productDetails, setProductDetails] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch(`https://fakestoreapi.com/products/${productId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setProductDetails(data);
            })
            .catch(error => {
                setError(error.message);
            });
    }, [productId]); // 依赖项为productId，当productId变化时重新获取数据

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!productDetails) {
        return <p>Loading...</p>;
    }

    return (

        <div className="bg-gray-100 dark:bg-gray-800 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row -mx-4">
                    <div className="md:flex-1 px-4">
                        <div className="h-[460px] rounded-lg bg-gray-300 dark:bg-gray-700 mb-4">
                            <img className="w-full h-full object-contain" src={productDetails.image}
                                 alt="Product Image"/>
                        </div>

                    </div>
                    <div className="md:flex-1 px-4">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{productDetails.title}</h2>
                        <div className="flex mb-4">
                            <div className="mr-4">
                                <span className="font-bold text-gray-700 dark:text-gray-300 text-lg">Price: </span>
                                <span className="text-gray-600 dark:text-gray-300 text-lg">{productDetails.price}</span>
                            </div>
                            <div>
                                <span className="font-bold text-gray-700 dark:text-gray-300 text-lg" >Availability: </span>
                                <span className="text-gray-600 dark:text-gray-300 text-lg">In Stock</span>
                            </div>
                        </div>

                        <div>
                            <span className="font-bold text-gray-700 dark:text-gray-300 text-lg">Product Description:</span>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                                {productDetails.description}
                            </p>
                        </div>
                        <br/>
                        <div className="flex -mx-2 mb-4">
                            <div className="w-1/2 px-2">
                                <button
                                    className="w-full bg-gray-900 dark:bg-gray-600 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800 dark:hover:bg-gray-700">Add
                                    to Cart
                                </button>
                            </div>
                            <div className="w-1/2 px-2">
                                <button
                                    className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 px-4 rounded-full font-bold hover:bg-gray-300 dark:hover:bg-gray-600">Add
                                    to Wishlist
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default ProductDetail;
