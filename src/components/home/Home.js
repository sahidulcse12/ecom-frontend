import { useEffect, useState } from "react";
import { getCategories, getFilteredProducts, getProducts } from "../../api/apiProduct";
import { isAuthenticated, userInfo } from "../../utils/auth";
import { showError, showSuccess } from "../../utils/messages";
import { prices } from "../../utils/prices";
import { addToCart } from '../../api/apiOrder';
import Layout from "../Layout";
import Card from "./Card";
import CheckBox from "./CheckBox";
import RadioBox from "./RadioBox";

const Home = () => {

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [order, setOrder] = useState('desc');
    const [sortBy, setsortBy] = useState('createdAt');
    const [limit, setLimit] = useState(30);
    const [skip, setSkip] = useState(0);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [filters, setFilters] = useState({
        category: [],
        price: []
    });

    useEffect(() => {
        getProducts(sortBy, order, limit)
            .then(response => setProducts(response.data))
            .catch(err => setError('Failed to load products'))

        getCategories()
            .then(response => setCategories(response.data))
            .catch(err => setError('Failed to load categories'))
    }, [])

    const handleAddToCart = product => () => {
        if (isAuthenticated()) {
            setError(false);
            setSuccess(false);
            const user = userInfo();
            const cartItem = {
                user: user._id,
                product: product._id,
                price: product.price,
            }
            addToCart(user.token, cartItem)
                .then(response => setSuccess(true))
                .catch(err => {
                    if (err.response) setError(err.response.data);
                    else setError("Adding to cart failed!");
                })
        } else {
            setSuccess(false);
            setError("Please Login First!");
        }
    }


    const handleFilters = (myFilters, filterBy) => {
        const newFilters = { ...filters };
        if (filterBy === 'category') {
            newFilters[filterBy] = myFilters;
        }
        if (filterBy === 'price') {
            const data = prices;
            let arr = [];
            for (let i in data) {
                if (data[i].id === parseInt(myFilters)) {
                    arr = data[i].arr;
                }
            }
            newFilters[filterBy] = arr;
        }
        setFilters(newFilters);
        getFilteredProducts(skip, limit, newFilters, order, sortBy)
            .then(response => setProducts(response.data))
            .catch(err => setError('Failed to load products'))
    }


    const showCategories = () => {
        return (<>
            <div className="row">
                <div className="col-sm-3">
                    <h5>Filter By Categories:</h5>
                    <ul>
                        <CheckBox
                            categories={categories}
                            handleFilters={myFilters => handleFilters(myFilters, 'category')}
                        />
                    </ul>
                </div>
                <div className="col-sm-5">
                    <h5>Filter By Prices:</h5>
                    <div className="row">
                        <RadioBox
                            prices={prices}
                            handleFilters={myFilters => handleFilters(myFilters, 'price')} />
                    </div>
                </div>
            </div>
        </>)
    }



    return (
        <Layout title="Home Page" className="container">
            {showCategories()}
            <div style={{ width: '100%' }}>
                {showError(error, error)}
                {showSuccess(success, 'Added to cart successfully')}
            </div>
            <div className="row">
                {products && products.map(product => <Card product={product} key={product._id} handleAddToCart={handleAddToCart(product)} />)}
            </div>
        </Layout>
    )
}

export default Home;