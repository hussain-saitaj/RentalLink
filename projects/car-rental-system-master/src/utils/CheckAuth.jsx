
import { auth, firestore } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { collection, doc ,getDoc } from "firebase/firestore";
import { addUser, removeUser } from "./userSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";


const CheckAuth = () => {
   const location = useLocation();
   const navigate = useNavigate();
    const dispatch = useDispatch();
    const check = async (user) => {
        const docRef = doc(collection(firestore, "users"), user.uid);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            const userRole = userData.role; // Assuming role is stored in Firestore
            dispatch(addUser({
                email: user.email,
                name: userData.name, // Assuming name is stored in Firestore
                role: userRole,
                uid: docSnapshot.id
            }));
        } 
    }
    
        useState(() =>{
        onAuthStateChanged(auth, (user) => {
            if (user) {
                check(user);
                    if(location.pathname !== "/login"){
                    navigate(location.pathname);
                    }
                    else{
                        navigate("/");
                    }
                
                
            } else {
                // Redirect to the login page if user is not authenticated
                dispatch(removeUser());
                navigate("/"); 
            }
        });},[navigate,dispatch])
    
}



export default CheckAuth;
