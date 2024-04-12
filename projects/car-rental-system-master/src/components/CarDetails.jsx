import Header from "./Header";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { collection, doc, getDoc, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../firebase";
import RentalForm from "./RentalForm";
import ReviewCard from "./ReviewCard";
import { useSelector } from "react-redux";
import CarForm from "./CarForm";

const CarDetails = () => {
    const user = useSelector(store => store.user);
    const { carID } = useParams();
    const [car, setCar] = useState(null);
    const [reviews, setReviews] = useState(null);
    const [owner, setOwner] = useState(null);

    
    useEffect(() => {
        const fetchCarDetails = async () => {
            try {
                const docRef = doc(firestore, "cars", carID);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const carData = {
                        id: docSnap.id,
                        ...docSnap.data()
                    };
                    setCar(carData);
                    return carData; // Return car data for chaining
                } else {
                    console.log("No such document!");
                    return null; // Return null to indicate no car was found
                }
            } catch (error) {
                console.error("Error fetching car details: ", error);
                return null; // Return null in case of error
            }
        };

        const fetchCarReviews = async () => {
            try {
                const q = query(collection(firestore, "reviews"), where("carID", "==", carID));
                const querySnapshot = await getDocs(q);
                const reviewsList = [];
                querySnapshot.forEach((doc) => {
                    reviewsList.push(doc.data());
                });
                setReviews(reviewsList);
            } catch (error) {
                console.error("Error fetching car reviews: ", error);
            }
        };

        const fetchOwnerDetails = async (uid) => {
            try {
                const docRef = doc(collection(firestore, "users"), uid);
                const docSnapshot = await getDoc(docRef);

                if (docSnapshot.exists()) {

                    setOwner(docSnapshot.data());
                } else {
                    console.log("No such user!");
                }
            } catch (error) {
                console.error("Error fetching owner details: ", error);
            }
        };

        fetchCarDetails().then(carData => {
            if (carData) {
                fetchOwnerDetails(carData.oid);
            }
        });
        fetchCarReviews();
    }, [carID]);
    return (
        <div>
            {car ? <div><div className="bg-cover bg-center w-[100%] h-[75vh] text-white  text-center flex flex-col justify-between"
                style={{ backgroundImage: `url("${car.imageUrl}")` }}>
                <div className="bg-[rgba(250,250,250,0.7)] h-[20vh] flex flex-col justify-between text-black">
                    <Header />
                </div>
            </div>
                <div className="w-[85%] mx-auto mt-10 flex flex-col-reverse lg:flex-row">
                    <div className="lg:w-[70%]">
                        <h1 className="text-5xl font-bold">
                            {car.name}
                        </h1>
                        <div className="flex mt-3">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M11.9998 17L6.12197 20.5902L7.72007 13.8906L2.48926 9.40983L9.35479 8.85942L11.9998 2.5L14.6449 8.85942L21.5104 9.40983L16.2796 13.8906L17.8777 20.5902L11.9998 17Z"></path></svg>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M11.9998 17L6.12197 20.5902L7.72007 13.8906L2.48926 9.40983L9.35479 8.85942L11.9998 2.5L14.6449 8.85942L21.5104 9.40983L16.2796 13.8906L17.8777 20.5902L11.9998 17Z"></path></svg>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M11.9998 17L6.12197 20.5902L7.72007 13.8906L2.48926 9.40983L9.35479 8.85942L11.9998 2.5L14.6449 8.85942L21.5104 9.40983L16.2796 13.8906L17.8777 20.5902L11.9998 17Z"></path></svg>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M11.9998 17L6.12197 20.5902L7.72007 13.8906L2.48926 9.40983L9.35479 8.85942L11.9998 2.5L14.6449 8.85942L21.5104 9.40983L16.2796 13.8906L17.8777 20.5902L11.9998 17Z"></path></svg>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M11.9998 17L6.12197 20.5902L7.72007 13.8906L2.48926 9.40983L9.35479 8.85942L11.9998 2.5L14.6449 8.85942L21.5104 9.40983L16.2796 13.8906L17.8777 20.5902L11.9998 17Z"></path></svg>
                            <span className="text-sm">{car.rating}</span>
                        </div>
                        <div className="border-b-2 border-gray-300 border-dashed w-[95%]"></div>
                        <div className="flex  gap-[10%] text-gray-600 my-5 px-4 flex-col items-center  lg:flex-row">
                            <div className="flex justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="30" height="30"><path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H18C18 18.6863 15.3137 16 12 16C8.68629 16 6 18.6863 6 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z"></path></svg>
                                <span>{car.passengers} Passengers</span>
                            </div>
                            <div className="flex justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" fill="currentColor"><path d="M15 3C15.5523 3 16 3.44772 16 4V6H21C21.5523 6 22 6.44772 22 7V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V7C2 6.44772 2.44772 6 3 6H8V4C8 3.44772 8.44772 3 9 3H15ZM16 8H8V19H16V8ZM4 8V19H6V8H4ZM14 5H10V6H14V5ZM18 8V19H20V8H18Z"></path></svg>
                                <span>{car.luggage} Luggages</span>
                            </div>
                            <div className="flex justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" fill="currentColor"><path d="M21 18V21H19V18H17V15H23V18H21ZM5 18V21H3V18H1V15H7V18H5ZM11 6V3H13V6H15V9H9V6H11ZM11 11H13V21H11V11ZM3 13V3H5V13H3ZM19 13V3H21V13H19Z"></path></svg>
                                <span>{car.gear}</span>
                            </div>

                        </div>
                        <div className="border-b-2 border-gray-300 border-dashed w-[95%]"></div>
                        <div className="w-[95%] mt-4">
                            <span className="text-xl font-bold">Refueling</span>
                            <p className="text-justify mb-4">
                                Meh synth Schlitz, tempor duis single-origin coffee ea next level ethnic fingerstache fanny pack nostrud. Photo booth anim 8-bit hella, PBR 3 wolf moon beard Helvetica. Salvia esse nihil, flexitarian Truffaut synth art party deep v chillwave. Seitan High Life reprehenderit consectetur cupidatat kogi. Et leggings fanny pack, elit bespoke vinyl art party Pitchfork selfies master cleanse.
                            </p>
                            <span className="text-xl font-bold">Car Wash</span>
                            <p className="text-justify mb-4">
                                Craft beer elit seitan exercitation, photo booth et 8-bit kale chips proident chillwave deep v laborum. Aliquip veniam delectus, Marfa eiusmod Pinterest in do umami readymade swag. Selfies iPhone Kickstarter, drinking vinegar jean vinegar stumptown yr pop-up artisan sunt. Craft beer elit seitan exercitation, photo booth
                            </p>
                            <span className="text-xl font-bold mb-4">No Smoking</span>
                            <p className="text-justify">
                                See-through delicate embroidered organza blue lining luxury acetate-mix stretch pleat detailing. Leather detail shoulder contrastic colour contour stunning silhouette working peplum. Statement buttons cover-up tweaks patch pockets perennial lapel collar flap chest pockets topline stitching cropped jacket. Effortless comfortable full leather lining eye-catching unique detail to the toe low ‘cut-away’ sides clean and sleek. Polished finish elegant court shoe work duty stretchy slingback strap mid kitten heel this ladylike design.
                            </p>
                        </div>
                        <div className="border-b-2 border-gray-300 border-dashed w-[95%] my-4"></div>
                        <div>
                            <h1 className="font-bold text-xl">Reviews</h1>
                            {reviews && reviews.map((review, index) => <ReviewCard key={index} data={review} />)}
                        </div>
                    </div>
                    <div className="lg:w-[30%]">
                    {user.role === 2 ? <RentalForm car={car} user={user} owner={owner} /> : <CarForm isEditMode={true} editData={car} />}
                    </div>:
                </div>
            </div> : <div>Loading</div>}
        </div>
    );
}
export default CarDetails;