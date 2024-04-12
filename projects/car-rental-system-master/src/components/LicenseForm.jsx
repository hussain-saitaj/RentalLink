import  { useState } from 'react';

function LicenseForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    licenseNumber: '',
    dateOfBirth: '',
    dateOfExpiry: '',
    dateOfIssue:'',
    stateOfIssue: '',
    address: '',
    licenseClass: '',
    contactEmail: '',
    contactPhone: '',
    licenseImage: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'licenseImage') {
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: files[0]
      }));
    } else {
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Here, you would typically handle form submission, e.g., sending data to a server
    alert('Form submitted. Check the console for the form data.');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto p-7 mt-10 shadow-md">
    <h1 className='text-center font-semibold text-xl text-black mb-5'>License Form</h1>

    <div className="grid grid-cols-2 gap-6 mb-4">
        <label className="flex items-center text-sm font-medium text-gray-700 justify-end mr-2">Full Name:</label>
        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="col-span-1 border-gray-300 border-b-2 rounded-md shadow-sm"/>
    </div>

    <div className="grid grid-cols-2 gap-6 mb-4">
        <label className="flex items-center text-sm font-medium text-gray-700 justify-end mr-2">License Number:</label>
        <input type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} required className="col-span-1 border-gray-300 border-b-2 rounded-md shadow-sm"/>
    </div>

    <div className="grid grid-cols-2 gap-6 mb-4">
        <label className="flex items-center text-sm font-medium text-gray-700 justify-end mr-2">Date of Birth:</label>
        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required className="col-span-1 border-gray-300 border-b-2 rounded-md shadow-sm"/>
    </div>

    <div className="grid grid-cols-2 gap-6 mb-4">
        <label className="flex items-center text-sm font-medium text-gray-700 justify-end mr-2">State/Country of Issue:</label>
        <input type="text" name="stateOfIssue" value={formData.stateOfIssue} onChange={handleChange} required className="col-span-1 border-gray-300 border-b-2 rounded-md shadow-sm"/>
    </div>

    <div className="grid grid-cols-2 gap-6 mb-4">
        <label className="flex items-center text-sm font-medium text-gray-700 justify-end mr-2">Address:</label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} required className="col-span-1 border-gray-300 border-b-2 rounded-md shadow-sm"/>
    </div>

    <div className="grid grid-cols-2 gap-6 mb-4">
        <label className="flex items-center text-sm font-medium text-gray-700 justify-end mr-2">License Class:</label>
        <input type="text" name="licenseClass" value={formData.licenseClass} onChange={handleChange} required className="col-span-1 border-gray-300 border-b-2 rounded-md shadow-sm"/>
    </div>

    <div className="grid grid-cols-2 gap-6 mb-6">
        <label className="flex items-center text-sm font-medium text-gray-700 justify-end mr-2">Upload Photo of License:</label>
        <input type="file" name="licenseImage" onChange={handleChange} required className="col-span-1 border-gray-300 rounded-md shadow-sm file:bg-green-500 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:text-white file:cursor-pointer hover:file:bg-green-600"/>
    </div>

    <div className="flex justify-center">
        <input type="submit" value="Submit" className="cursor-pointer bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"/>
    </div>
</form>


  );
}

export default LicenseForm;
