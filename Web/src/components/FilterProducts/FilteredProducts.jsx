import React, {useState, useEffect} from 'react';
import Heading from "../Home/Shared/Heading.jsx";
import Button from "../Home/Shared/Button.jsx";
import { Link } from 'react-router-dom';
const FilteredProducts = ({category}) => {
    const [ProductsData, setProductsData] = useState([]);

    useEffect(() => {
        fetch(`https://fakestoreapi.com/products/category/${category}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // 处理数据，转换为ProductCard需要的格式
                const transformedData = data.map(product => ({
                    id: product.id,
                    img: product.image,
                    title: product.title,
                    price: product.price,
                    description: product.description,
                    rating: product.rating
                }));
                // 更新ProductsData状态
                console.log(data);
                setProductsData(transformedData);
            })
            .catch(error => {
                console.error('You have an error: ', error);
            });
    }, [category]); // 空依赖数组保证了effect只在组件挂载时运行

    return (
        <div>
            <br/>
            <div className="container">
                <Heading title="Filtered Products"/>
                <div className="mb-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 place-items-center">
                        {ProductsData.map((data) => (
                            <div
                                className="group"
                                key={data.id}
                            >
                                <div className="relative">
                                    <img
                                        src={data.img}
                                        alt=""
                                        className="h-[180px] w-[260px] object-cover rounded-md"
                                    />
                                    <div
                                        className="hidden group-hover:flex absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 h-full w-full text-center group-hover:backdrop-blur-sm justify-center items-center duration-200 rounded-md">
                                        <Link to={`/ProductDetail/${data.id}`}>
                                            <Button
                                                text={"View Details"}
                                                bgColor={"bg-primary"}
                                                textColor={"text-white"}
                                            />
                                        </Link>
                                    </div>
                                </div>
                                <div className="leading-7">
                                    <h2 className="font-semibold">{data.title}</h2>
                                    <h2 className="font-bold">${data.price}</h2>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FilteredProducts;
