
import { useEffect, useState } from "react";
import { collection, query, getDocs, where } from "firebase/firestore";
import { firestore } from "../firebase";


const Admin = () => {
  const [userList, setUserList] = useState([]);
  const [filterUsers, setFilterUsers] = useState([]);
  const [carsList, setCarsList] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [activeTab, setActiveTab] = useState('Customers'); // Track the active tab

  const fetchUsers = async () => {
    const q = query(collection(firestore, "users"));
    const querySnapshot = await getDocs(q);
    setUserList(querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })));
  }

  const filterOwners = () => {
    setFilterUsers(userList.filter(user => user.role === 1));
  }

  const filterCustomers = () => {
    setFilterUsers(userList.filter(user => user.role === 2));
  }

  const fetchCarsList = async (driver) => {
    setSelectedCar(null);
    const q = query(collection(firestore, "cars"), where("oid", "==", driver.id));
    const querySnapshot = await getDocs(q);
    setCarsList(querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })));
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (activeTab === 'Car Owners') {
      filterOwners();
    } else {
      filterCustomers();
    }
  }, [userList, activeTab]); // Added activeTab as a dependency

  const navigation = [
    { name: 'Customers', current: activeTab === 'Customers', fun: () => setActiveTab('Customers') },
    { name: 'Car Owners', current: activeTab === 'Car Owners', fun: () => setActiveTab('Car Owners') },
  ];

  return (
    <div className="flex bg-gray-200">
      <div className="w-64" aria-label="Sidebar">
        <div className="overflow-y-auto py-4 px-3 bg-gray-50 rounded h-[100vh] dark:bg-gray-800">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <a
                  onClick={item.fun}
                  className={`flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 ${item.current ? 'bg-gray-200 dark:bg-gray-700' : ''
                    }`}
                >
                  <span>{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="w-[20%] m-7">
        {/* User List */}
        <div className="bg-white shadow rounded-md p-4 h-[94vh]">
          {/* Dynamic Header based on Active Tab */}
          <div className="pb-2 border-b mb-3">
            <h3 className="text-lg font-semibold text-gray-700">{activeTab === 'Car Owners' ? 'All Owners' : 'All Customers'}</h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {/* Users */}
            {filterUsers.map((user) => (
              <li key={user.id} className="py-3 flex justify-between items-center" onClick={() => { setSelectedDriver(user); activeTab === 'Car Owners' && fetchCarsList(user);}}>
                <div className="flex items-center">
                  <div className="ml-3">
                    <div className="flex justify-between">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'Approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {user.status}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="w-[60%] p-4 bg-gray-50">
        {/* Conditional Rendering based on Active Tab */}
        <div className="bg-white shadow-lg rounded-md p-4 w-full">
              <div className="pb-2 border-b mb-3">
                <h3 className="text-lg font-semibold text-gray-700">{activeTab === 'Car Owners' ? "Owner Information" : "Customer Information"}</h3>
              </div>
              {selectedDriver && (
                <div className="flex items-center mb-4">
                  <div className="flex-1">
                    <h4 className="text-md font-medium text-gray-900">{selectedDriver?.name}</h4>
                    <p className="text-sm text-gray-500">ID: {selectedDriver?.id}</p>
                  </div>
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${selectedDriver?.status === 'Approved'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}
                  >
                    {selectedDriver?.status}
                  </span>
                </div>
              )}


            </div>
        {activeTab === 'Car Owners' && (
          <>
            {/* Car Owners Information & Cars List */}
            
            <div className="bg-white shadow-lg rounded-md p-4 w-full mt-5">
              <div className="pb-2 border-b mb-3">
                <h3 className="text-lg font-semibold text-gray-700">Cars</h3>
              </div>
              <div className="flex ">
                {carsList && carsList.map((car) => (
                  <div key={car.id} className="md:w-1/2 lg:w-1/3 flex  items-center" onClick={() => setSelectedCar(car)}>

                    <img src={car.imageUrl} alt={car.carName} className="w-24 h-24 h-auto object-cover" />
                    <div className="text-center mb-2">{car.carName}</div>

                  </div>
                ))}
                <div className="boredr-l-2 border-black w-2/3">
                  <div className="w-[100%]">
                    {selectedCar && 
                    <div className="p-5 flex flex-col gap-3">
                <div className="flex justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">{selectedCar.carName}</h1>
                        <div className="flex text-center mt-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M11.9998 17L6.12197 20.5902L7.72007 13.8906L2.48926 9.40983L9.35479 8.85942L11.9998 2.5L14.6449 8.85942L21.5104 9.40983L16.2796 13.8906L17.8777 20.5902L11.9998 17ZM11.9998 14.6564L14.8165 16.3769L14.0507 13.1664L16.5574 11.0192L13.2673 10.7554L11.9998 7.70792L10.7323 10.7554L7.44228 11.0192L9.94893 13.1664L9.18311 16.3769L11.9998 14.6564Z"></path></svg>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M11.9998 17L6.12197 20.5902L7.72007 13.8906L2.48926 9.40983L9.35479 8.85942L11.9998 2.5L14.6449 8.85942L21.5104 9.40983L16.2796 13.8906L17.8777 20.5902L11.9998 17ZM11.9998 14.6564L14.8165 16.3769L14.0507 13.1664L16.5574 11.0192L13.2673 10.7554L11.9998 7.70792L10.7323 10.7554L7.44228 11.0192L9.94893 13.1664L9.18311 16.3769L11.9998 14.6564Z"></path></svg>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M11.9998 17L6.12197 20.5902L7.72007 13.8906L2.48926 9.40983L9.35479 8.85942L11.9998 2.5L14.6449 8.85942L21.5104 9.40983L16.2796 13.8906L17.8777 20.5902L11.9998 17ZM11.9998 14.6564L14.8165 16.3769L14.0507 13.1664L16.5574 11.0192L13.2673 10.7554L11.9998 7.70792L10.7323 10.7554L7.44228 11.0192L9.94893 13.1664L9.18311 16.3769L11.9998 14.6564Z"></path></svg>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M11.9998 17L6.12197 20.5902L7.72007 13.8906L2.48926 9.40983L9.35479 8.85942L11.9998 2.5L14.6449 8.85942L21.5104 9.40983L16.2796 13.8906L17.8777 20.5902L11.9998 17ZM11.9998 14.6564L14.8165 16.3769L14.0507 13.1664L16.5574 11.0192L13.2673 10.7554L11.9998 7.70792L10.7323 10.7554L7.44228 11.0192L9.94893 13.1664L9.18311 16.3769L11.9998 14.6564Z"></path></svg>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M11.9998 17L6.12197 20.5902L7.72007 13.8906L2.48926 9.40983L9.35479 8.85942L11.9998 2.5L14.6449 8.85942L21.5104 9.40983L16.2796 13.8906L17.8777 20.5902L11.9998 17ZM11.9998 14.6564L14.8165 16.3769L14.0507 13.1664L16.5574 11.0192L13.2673 10.7554L11.9998 7.70792L10.7323 10.7554L7.44228 11.0192L9.94893 13.1664L9.18311 16.3769L11.9998 14.6564Z"></path></svg>
                            <span className="text-sm">{selectedCar.rating}</span>
                        </div>
                    </div>
                    <div className="flex">
                        <span>$</span>
                        <div className="flex flex-col">
                            <span className="text-3xl font-bold">{selectedCar.pph}</span>
                            <span>Per Hour</span>
                        </div>
                    </div>
                </div>
                <div className="flex w-[50%] gap-[10%] text-gray-600">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H18C18 18.6863 15.3137 16 12 16C8.68629 16 6 18.6863 6 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z"></path></svg>
                        <span>{selectedCar.passengers}</span>
                    </div>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M15 3C15.5523 3 16 3.44772 16 4V6H21C21.5523 6 22 6.44772 22 7V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V7C2 6.44772 2.44772 6 3 6H8V4C8 3.44772 8.44772 3 9 3H15ZM16 8H8V19H16V8ZM4 8V19H6V8H4ZM14 5H10V6H14V5ZM18 8V19H20V8H18Z"></path></svg>
                        <span>{selectedCar.luggage}</span>
                    </div>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M21 18V21H19V18H17V15H23V18H21ZM5 18V21H3V18H1V15H7V18H5ZM11 6V3H13V6H15V9H9V6H11ZM11 11H13V21H11V11ZM3 13V3H5V13H3ZM19 13V3H21V13H19Z"></path></svg>
                        <span>{selectedCar.gear}</span>
                    </div>
                </div>
            </div>}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {activeTab === 'Customers' && (
          <div className="bg-white shadow-lg rounded-md p-4 w-full mt-5">
            <h3 className="text-lg font-semibold text-gray-700">License Details</h3>
            
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
