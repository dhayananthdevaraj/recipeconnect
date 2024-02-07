import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./ProductDetails.css";
import axios from 'axios';
import { apiUrl } from '../apiconfig';

const RentalList = () => {
    const [recipe, setRecipe] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [showLogoutPopup, setshowLogoutPopup] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortValue, setSortValue] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRentals();
    }, [searchTerm, sortValue]);

    async function fetchRentals() {
        try {
            const userResponse = await axios.get(apiUrl + '/api/users', {
                headers: { Authorization: `${localStorage.getItem("token")}` }
            });
            const productResponse = await axios.get(
                `${apiUrl}/api/recipe?searchValue=${searchTerm}&sortValue=${sortValue}`,
                {
                    headers: { Authorization: `${localStorage.getItem("token")}` }
                }
            );
          console.log("userResponse",userResponse);
          console.log("productResponse",productResponse);

            const users = await userResponse.data;
            const recipeData = await productResponse.data;

            const recipeWithUserData = recipeData.map((recipe) => {
                console.log("recipe",recipe);
                console.log("users",users);
                const user = users.find(u => u.userId  === recipe.userId || u.userId === recipe.user_id);
                return {
                    ...recipe,
                    userName: user ? `${user.firstName} ${user.lastName}` : "Unknown",
                    userEmail: user ? user.email : "Unknown",
                    userPhone: user ? user.mobileNumber : "Unknown"
                };
            });
            console.log("recipeWithUserData",recipeWithUserData);
            setRecipe(recipeWithUserData);
        } catch (error) {
            navigate("/error");
        }
    }

    const openPopup = (recipe) => {
        setSelectedRecipe(recipe);
        setShowPopup(true);
    };

    const closePopup = () => {
        setSelectedRecipe(null);
        setShowPopup(false);
    };

    return (
        <div className={`RecipeList`}>
        {/* <button className='styledbutton' onClick={() => { navigate("/login") }}>Logout</button> */}
        <button className='styledbutton' onClick={() => { setshowLogoutPopup(true) }}>Logout</button>

        <h1>Recipe Hub</h1>
        <div className="filter-container">
                <div className="search-box">
                    <input
                        id='searchBox'
                        type="text"
                        placeholder="Search by recipe name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="sort-box">
                    <label htmlFor="sortDropdown">Sort By Price:</label>
                    <select
                        id="sortDropdown"
                        value={sortValue}
                        onChange={(e) => setSortValue(parseInt(e.target.value))}
                    >
                        <option value={1}>Price Ascending</option>
                        <option value={-1}>Price Descending</option>
                    </select>
                </div>
            </div>

        <div className="card-container">
            {recipe.length ? recipe.map((recipe) => (
                <div key={recipe._id} className="recipe-card" onClick={() => openPopup(recipe)}>
                    <img src={recipe.photo} alt={recipe.recipeName} />
                    <div className="card-details">
                        <h2>{recipe.recipeName}</h2>
                        <p>Description: {recipe.description}</p>
                        <p>Price: {recipe.price}</p>
                    </div>
                </div>
            )) : (
                <div className="norecord" style={{ textAlign: "center" }}>
                    No records found
                </div>
            )}
        </div>

            {showPopup && selectedRecipe && (
                <div className="popup">
                    <div className="popup-content">
                        <span className="close" onClick={closePopup}>&times;</span>

                        <h2>{selectedRecipe.recipeName}</h2>
                        <h2>Details</h2>
                        <p><strong>Description: </strong> {selectedRecipe.description}</p>
                        <p><strong>Recipe Price: </strong>{selectedRecipe.price}</p>
                        <p><strong>Category: </strong> {selectedRecipe.category}</p>
                        <p><strong>Serve: </strong> {selectedRecipe.servingSize}</p>
                        <p><strong>Ingrediants: </strong>{selectedRecipe.ingredients}</p>
                        <p><strong>Posted By: </strong> {selectedRecipe.userName}</p>
                        <p><strong>Contact Email: </strong> {selectedRecipe.userEmail}</p>
                        <p><strong>Contact Phone: </strong> {selectedRecipe.userPhone}</p>
                    </div>
                </div>
            )}

                    {showLogoutPopup && (
                            <div className="delete-popup">
                            <p>Are you sure you want to Logout?</p>
                            <button onClick={()=>{
                                localStorage.clear();
                                navigate("/login");
                            }}>Yes, Logout</button>
                            <button
                                onClick={() => {
                                setshowLogoutPopup(false);
                                }}
                            >
                                Cancel
                            </button>
                            </div>
                        )}
        </div>
    );
};

export default RentalList;
