/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import { collection, query, where, getDoc, getDocs, updateDoc, doc, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebase";
import ReviewCard from "./ReviewCard";
import Rating from "./Rating";
import { toast } from "react-toastify";
import stripe from "stripe";


const BookingDetails = ({ toggle, data, user, car }) => {
    const [owner, setOwner] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [review, setReview] = useState(null);
    const [paymentURL,setPaymentURL] = useState(null);
    const [paymentID,setPaymentID] = useState(null);
    const stripeClient = stripe('sk_test_51OrcvcIPb0k3ZIackmdIjWOXrf43OceCMRzfnv8MpCt3lYDEztQckLff8utuihcSrsjrizA9Swzev4sE23OEvbuu00CgyscuNs');
    const updateStatus = async (newStatus) => {
        const bookingDocRef = doc(firestore, "bookings", data.id); // Reference to the specific booking document

        try {
            await updateDoc(bookingDocRef, {
                status: newStatus, // Update the status field with the new status
            });
            toast.success(`Booking status updated to: , ${newStatus}`);

        } catch (error) {
            console.error("Error updating booking status: ", error);
        }
    }
    const fetchOwnerDetails = async (uid) => {
        const docRef = doc(collection(firestore, "users"), uid);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {

            setOwner(docSnapshot.data());
        } else {
            console.log("No such user!");
        }
    }
    const fetchCustomerDetails = async (uid) => {
        const docRef = doc(collection(firestore, "users"), uid);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {

            setCustomer(docSnapshot.data());
        } else {
            console.log("No such user!");
        }
    }

    const fetchReviewDetails = async (bid) => {
        const q = query(collection(firestore, "reviews"), where("bid", "==", bid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            console.log(doc.data())
            setReview(doc.data());
        });
    }

    const fetchPaymentDetails = async (sessionId) => {
        

        try {
            const session = await stripeClient.checkout.sessions.retrieve(
                sessionId
            );
            setPaymentID(session.payment_intent);
            const docRef = doc(collection(firestore,"users",data.cid,"payments"),session.payment_intent)
            const paymentDetails = await getDoc(docRef);
            setPaymentURL(paymentDetails.data().charges.data[0].receipt_url);
        } catch (error) {
            console.error('Error retrieving payment details:', error);
        }
    }
   
    const refund = async() => {
        await stripeClient.refunds.create({
        payment_intent: paymentID,
      });
    }
    useEffect(() => {
        // Define a function to fetch user details that you can call later
        const fetchUserDetails = async () => {
            fetchOwnerDetails(data.oid);
            fetchCustomerDetails(data.cid);
            fetchPaymentDetails(data.sessionId);
        };
        fetchReviewDetails(data.id);

        // Call fetchUserDetails to fetch owner and customer details
        fetchUserDetails();

        // Set up a real-time listener for the booking document
        // const bookingDocRef = doc(firestore, "bookings", data.id); // Reference to the specific booking document
        // const unsubscribe = onSnapshot(bookingDocRef, (doc) => {
        //     if (doc.exists()) {
        //         const updatedData = doc.data();
        //         // Check if the status has changed and show an alert if it has
        //         if (updatedData.status && updatedData.status !== data.status) {
        //            toast.success(`Booking status updated to: ${updatedData.status}`);
        //             // Optionally, update local state to reflect the new status
        //             // This step depends on whether you're managing state for the booking's details
        //         }
        //     } else {
        //         console.log("No such document!");
        //     }
        // }, (error) => {
        //     console.error("Error listening to booking document: ", error);
        // });

        // // Cleanup the listener when the component unmounts or data.id changes
        // return () => unsubscribe();

    }, [data.id, data.oid, data.cid, data.status]);
    return (
        <div className="border-2 border-gray-400 absolute -bottom-4 left-[10%] w-[80%] mx-auto bg-gray-100 p-4 shadow-xl">
            <div>
                <div className="flex justify-between border-b-2 border-gray-300 p-2">
                    <h1 className="font-bold text-xl">Booking Details</h1>
                    <span onClick={() => toggle()} className="cursor-pointer">x</span>
                </div>
                <div className="border-b-2 border-gray-300 p-2">
                    <h1 className="font-bold">Customer Details</h1>
                    <div className="flex justify-between">
                        <h1>{customer && customer.name}</h1>
                        <h1>{customer && customer.email}</h1>
                        <h1>{customer && customer.phone}</h1>
                    </div>
                </div>
                <div className="border-b-2 border-gray-300 p-2">
                    <h1 className="font-bold">Owner Details</h1>
                    <div className="flex justify-between">
                        <h1>{owner && owner.name}</h1>
                        <h1>{owner && owner.email}</h1>
                        <h1>{owner && owner.phone}</h1>
                    </div>
                </div>
                <div className="border-b-2 border-gray-300 p-2">
                    <h1 className="font-bold">Car Details</h1>
                    <div className="flex justify-between">
                        <h1>{car && car.carName}</h1>
                        <h1>{car && car.type}</h1>
                        <h1>{car && car.gear}</h1>
                    </div>
                </div>
                <div className="border-b-2 border-gray-300 p-2">
                    <h1 className="font-bold">Pick Up Details</h1>
                    <div className="flex justify-between">
                        <h1>{data.pickUpAddress}</h1>
                        <h1>{data.pickUpDate}</h1>
                        <h1>{data.pickUpTime}</h1>
                    </div>
                </div>
                <div className="border-b-2 border-gray-300 p-2">
                    <h1 className="font-bold">Drop Off Details</h1>
                    <div className="flex justify-between">
                        <h1>{data.dropOffAddress}</h1>
                        <h1>{data.dropOffDate}</h1>
                        <h1>{data.dropOffTime}</h1>
                    </div>
                </div>
                <div className="flex justify-between p-2">
                    <h1>Total : {data.total}</h1>
                    <h1>Status : {data.status}</h1>
                </div>
                {user.role === 2 && ((data.status === "pending" &&
                    <div className="flex justify-center">
                        <button className="p-2 bg-red-300" onClick={() => {updateStatus("cancelled");refund()}}>Cancel</button>
                    </div>) || ((data.status === "accepted" &&
                        <div className="flex justify-center">
                            <button className="p-2 bg-green-300" onClick={() => updateStatus("completed")}>Complete</button>
                        </div>)))
                }
                {(user.role === 1 && data.status === "pending") && <div className="w-[30%] flex justify-between mx-auto">
                    <button className="p-2 bg-green-300" onClick={() => updateStatus("accepted")}>Accept</button>
                    <button className="p-2 bg-red-300" onClick={() => {updateStatus("declined");refund();}}>Decline</button>
                </div>}
                {
                    paymentURL && <button className="p-2 bg-green-200 rounded-md" onClick={() =>window.open(paymentURL,'_blank').focus()}>View Invoice</button>
                }
                {
                    data.status === "completed" && (user.role === 2 && review === null) ? <Rating data={data} setReview={setReview} /> : review && <ReviewCard data={review} />
                }
                

            </div>
        </div>
    );
}
export default BookingDetails;