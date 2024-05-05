import React, {useState} from 'react';
import FilteredProducts from "./FilteredProducts.jsx";

const FilterProducts = () => {
    const productCategories = ["electronics", "jewelery", "men's clothing", "women's clothing"]
    const sortedCategories = productCategories.sort()
    const [category, setCategory] = useState(sortedCategories[0]); // 默认选择第一个类别
    const [keyword, setKeyword] = useState('');
    const [submittedCategory, setSubmittedCategory] = useState(category)
    const handleCategoryChange = (event) => {
        const category = event.target.value;
        setCategory(category);
    };

    const handleKeywordChange = (event) => {
        const keyword = event.target.value;
        setKeyword(keyword)
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmittedCategory(category);
        // further api calls
        const formData = new URLSearchParams({
            category: category,
            keyword: keyword,
            // ids:
        });
        fetch(`http://localhost:3000/api/products?${formData}`, {
            method: 'GET',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error('You have an error: ', error);
            });

    };




    return (
        <>
            <div>
                <p className="text-center text-primary font-semibold text-xl uppercase sm:text-2xl mb-4">
                    Search and Filter Products
                </p>
            </div>
            <form onSubmit={handleSubmit}
                  className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:space-x-4">
                <div className="flex-1">
                    <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
                        Filter by Categories
                    </label>
                    <select
                        value={category}
                        onChange={handleCategoryChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                        {productCategories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex-1">
                    <label htmlFor="keyword" className="block text-gray-700 text-sm font-bold mb-2">
                        Keywords
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        id="keyword"
                        value={keyword}
                        onChange={handleKeywordChange}
                        placeholder="Search products by keywords"/>
                </div>
                <button type="submit"
                        className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
                    Submit
                </button>
            </form>
            <FilteredProducts category={submittedCategory}/>
        </>

    );
};

export default FilterProducts;
