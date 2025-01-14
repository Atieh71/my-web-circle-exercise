import { useEffect, useState } from "react"; 
import { useDebouncedCallback } from "use-debounce";
import MenuItem from "../components/MenuItem/MenuItem.jsx";
import styles from "./RestaurantView.module.css";
import NavBar from "../components/NavBar/NavBar.jsx";
import SearchField from "../components/SearchField/SearchField.jsx";

const RestaurantView = () => {
  const [dishes, setDishes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [wishlist, setWishlist] = useState([]);

  //add/remove dishes from wishlist
  const toggleWishlist = (dish) => {
    if (wishlist.some((item) => item.idMeal === dish.idMeal)) {
      setWishlist(wishlist.filter((item) => item.idMeal !== dish.idMeal));
    } else {
      setWishlist([...wishlist, dish]); 
    }
  };

  const debouncedEffectHook = useDebouncedCallback(() => {
    let currentEffect = true;
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`)
      .then((res) => (res.ok ? res.json() : { meals: null }))
      .then((result) => {
        if (currentEffect) {
          setDishes(result.meals ?? []);
        }
      })
      .catch(() => setDishes([]));

    return () => {
      currentEffect = false;
    };
  }, 500);

  useEffect(debouncedEffectHook, [debouncedEffectHook]);


  const filteredDishes = dishes.filter((dish) =>
    dish.strMeal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <NavBar>
        <h1>ReDI React Restaurant</h1>
        <SearchField onSearchChange={setSearchTerm} />
      </NavBar>

      <div className={styles.restaurantWrapper}>
        
        {/* Wishlist Section */}
        <div className={styles.wishlist}>
          <h2>Wishlist</h2>
          {wishlist.length > 0 ? (
            <ul>
              {wishlist.map((dish) => (
                <li key={dish.idMeal}>{dish.strMeal}</li>
              ))}
            </ul>
          ) : (
            <p>No items in wishlist.</p>
          )}
        </div>

        {/* Menu Section */}
        <div className={styles.menu}>
          {filteredDishes.length > 0 ? (
            filteredDishes.map((dish) => (
              <MenuItem
                dish={dish}
                key={dish.idMeal}
                isInWishlist={wishlist.some((item) => item.idMeal === dish.idMeal)}
                onToggleWishlist={toggleWishlist}
              />
            ))
          ) : (
            <p>No dishes found :(</p>
          )}
        </div>
      </div>
    </>
  );
};

export default RestaurantView;
