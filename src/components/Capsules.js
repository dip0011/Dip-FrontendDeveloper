import React, { useEffect, useState } from "react";
import axios from 'axios';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "react-datepicker/dist/react-datepicker.css";

function Capsules() {
    const [capsules, setCapsules] = useState([]);
    const [selectedCapsule, setSelectedCapsule] = useState(null);
    const [page, setPage] = useState(0);

    const [filters, setFilters] = useState({
        status: '',
        original_launch: '',
        type: ''
    });

    async function fetchCapsulesData(id) {
        try {
            const offset = page * 9;
            const params = new URLSearchParams({
                limit: 9,
                offset: offset,
                ...filters
            });
            console.log(filters, 'filters');
            console.log(`${process.env.REACT_APP_SpaceX_URL}/v3/capsules?${params}`, 'Prms');
            const res = await axios.get(`${process.env.REACT_APP_SpaceX_URL}/v3/capsules?${params}`);
            setCapsules(res.data);

        } catch (error) {
            toast.error(error.response.data?.message || "Invalid Request", {
                position: toast.POSITION.BOTTOM_RIGHT,
            });
        }
    }

    const handleCardClick = (capsule) => {
        setSelectedCapsule(capsule);
    };

    const handleClosePopup = () => {
        setSelectedCapsule(null);
    };


    useEffect(() => {
        fetchCapsulesData();
    }, [page, filters]);

    return (
        <>
            < div className="p-4 md:p-6" >
                <h2 className="text-xl md:text-2xl font-semibold mb-2 md:mb-4">Search Capsules</h2>
                <div className="space-y-2 md:space-y-4">
                    {/* Search filters */}
                    <div className="flex flex-col md:flex-row justify-center md:items-end space-y-2 md:space-y-0 md:space-x-4">
                        <div className="w-full md:w-1/3">
                            <label className="block">Status:</label>
                            <select
                                value={filters.status}
                                name="status"
                                className="border rounded px-2 py-1 w-full"
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            >
                                <option value="">All</option>
                                <option value="retired">Retired</option>
                                <option value="unknown">Unknown</option>
                                <option value="active">Active</option>
                                <option value="destroyed">Destroyed</option>
                            </select>
                        </div>
                        <div className="w-full md:w-1/3">
                            <label className="block">Type:</label>
                            <input
                                type="text"
                                value={filters.type}
                                name="value"
                                className="border rounded px-2 py-1 w-full"
                                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                            />
                        </div>
                        <div className="w-full md:w-1/3">
                            <label className="block">Original Launch:</label>
                            <DatePicker
                                selected={filters.original_launch ? moment.utc(filters.original_launch).add(-5, 'hours').add(-30, 'minutes').toDate() : null}
                                onChange={(date) => {
                                    const adjustedDate = moment.utc(date).add(5, 'hours').add(30, 'minutes');
                                    setFilters({ ...filters, original_launch: adjustedDate.toISOString() });
                                }}
                                className="border rounded px-2 py-1 w-[93vw] md:w-full"
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeZone="IST"
                                timeIntervals={1}
                                timeCaption="time"
                                dateFormat="MMMM d, yyyy h:mm aa"
                            />
                        </div>
                        {/* Search button */}
                        <button
                            className="bg-blue-500 text-white px-4 py-2 leading-none rounded hover:bg-blue-600"
                            onClick={(e) => setFilters({ status: '',original_launch: '',type: '' })}
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div >

            {/* Data Grid */}
            < div className="p-4 md:p-6" >
                <h2 className="text-xl md:text-2xl font-semibold mb-2 md:mb-4">CapsuleX Data</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {capsules.length > 0 ?
                        capsules.map((capsule) => {
                            return (
                                <div
                                    key={capsule.capsule_serial}
                                    className="p-4"
                                    onClick={() => handleCardClick(capsule)}
                                >
                                    <div className="bg-white p-6 rounded shadow cursor-pointer hover:shadow-lg h-full">
                                        <h3 className="text-xl font-semibold">{capsule.capsule_serial}</h3>
                                        <p><span className="text-gray-600">Capsule Id:</span> {capsule.capsule_id}</p>
                                        {capsule.details ? <p><span className="text-gray-600">Description:</span> {capsule.details}</p> : null}
                                    </div>
                                </div>
                            )
                        })
                        : <div>
                            <p>No record found!</p>
                        </div>}
                </div>

                {/* Pagination */}
                {capsules.length > 0 ? <div className="mt-4 flex justify-center">
                    <button
                        onClick={() => setPage((preValue) => preValue - 1)}
                        disabled={page === 0 ? true : false}
                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600 disabled:bg-gray-400"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => setPage((preValue) => preValue + 1)}
                        disabled={capsules.length === 0 || capsules.length < 9 ? true : false}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                    >
                        Next
                    </button>
                </div> : null}

                {/* Item popup */}
                {selectedCapsule && (
                    <div className="fixed inset-0 flex items-center justify-center z-10 backdrop-blur-md">
                        {console.log(selectedCapsule, 'selectedCapsule')}
                        <div className="bg-white p-8 rounded shadow-lg max-w-md flex flex-col gap-1">
                            <h3 className="text-2xl font-semibold mb-4">
                                {selectedCapsule.capsule_id}
                            </h3>
                            <p><span className="text-gray-600">Status:</span> {selectedCapsule.status}</p>
                            {selectedCapsule?.original_launch && <p><span className="text-gray-600">Original Launch:</span> {moment.utc(selectedCapsule.original_launch).format('MMMM Do YYYY, h:mm:ss a')}</p>}
                            {selectedCapsule?.missions[0]?.name && <p><span className="text-gray-600">Missions:</span> {selectedCapsule.missions[0].name}</p>}
                            <p><span className="text-gray-600">Landings: </span>{selectedCapsule?.landings || 0}</p>
                            {selectedCapsule?.type && <p><span className="text-gray-600">Type:</span> {selectedCapsule.type}</p>}
                            {selectedCapsule?.details && <p><span className="text-gray-600">Details:</span> {selectedCapsule.details}</p>}
                            <p><span className="text-gray-600">Reuse Count:</span> {selectedCapsule?.reuse_count || 0}</p>
                            <button
                                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                onClick={handleClosePopup}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default Capsules;