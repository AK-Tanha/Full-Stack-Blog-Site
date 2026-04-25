import React from 'react';
import { Link } from 'react-router-dom';
import { useFetchAdsQuery, useDeleteAdMutation } from '../../../redux/features/ads/adsApi';
import { HiOutlinePencilAlt, HiOutlineTrash, HiOutlinePlusCircle, HiOutlineExternalLink } from 'react-icons/hi';

const ManageAds = () => {
    const { data: ads, isLoading, error, refetch } = useFetchAdsQuery();
    const [deleteAd] = useDeleteAdMutation();

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this ad?")) {
            try {
                await deleteAd(id).unwrap();
                alert("Ad deleted successfully!");
                refetch();
            } catch (error) {
                console.error("Failed to delete ad:", error);
                alert("Error deleting ad.");
            }
        }
    };

    if (isLoading) return <div className="p-10 text-center font-black uppercase text-indigo-600 animate-pulse">Loading Campaigns...</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-2">Manage Advertisements</h1>
                    <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em]">Campaign Performance & Control</p>
                </div>
                <Link 
                    to="/dashboard/add-ad"
                    className="flex items-center gap-3 bg-indigo-600 hover:bg-gray-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-indigo-100 hover:shadow-indigo-600/20 active:scale-95"
                >
                    <HiOutlinePlusCircle size={20} />
                    New Campaign
                </Link>
            </div>

            {error && (
                <div className="bg-rose-50 text-rose-600 p-8 rounded-[32px] border border-rose-100 text-center font-bold mb-10">
                    Failed to load advertisements. Please try again later.
                </div>
            )}

            <div className="grid grid-cols-1 gap-6">
                {ads && ads.length > 0 ? ads.map((ad) => (
                    <div key={ad._id} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex flex-col lg:flex-row items-center gap-8 group hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500">
                        {/* Ad Preview Section */}
                        <div className="w-full lg:w-72 h-32 md:h-40 rounded-2xl overflow-hidden relative shadow-inner flex-shrink-0">
                            <img src={ad.image} alt={ad.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
                                <span className="text-[8px] font-black uppercase text-indigo-600 tracking-widest">{ad.slot}</span>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                <p className="text-white text-[10px] font-black uppercase tracking-widest truncate">{ad.title}</p>
                            </div>
                        </div>

                        {/* Ad Details Section */}
                        <div className="flex-1 min-w-0 space-y-4 text-center lg:text-left w-full">
                            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4">
                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight truncate">{ad.title}</h3>
                                <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${ad.isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-gray-100 text-gray-400 border border-gray-200'}`}>
                                    {ad.isActive ? 'Active' : 'Paused'}
                                </span>
                            </div>
                            <p className="text-gray-500 font-bold text-sm uppercase tracking-wider line-clamp-1">{ad.subtitle}</p>
                            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6">
                                <a href={ad.link} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">
                                    <HiOutlineExternalLink size={16} />
                                    Destination Link
                                </a>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Added: {new Date(ad.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        {/* Actions Section */}
                        <div className="flex items-center gap-3 w-full lg:w-auto justify-center">
                            <Link 
                                to={`/dashboard/update-ad/${ad._id}`}
                                className="w-14 h-14 flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-indigo-600 hover:text-white rounded-2xl transition-all duration-300 group/btn shadow-sm"
                                title="Edit Campaign"
                            >
                                <HiOutlinePencilAlt size={22} className="group-hover/btn:scale-110 transition-transform" />
                            </Link>
                            <button 
                                onClick={() => handleDelete(ad._id)}
                                className="w-14 h-14 flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-rose-500 hover:text-white rounded-2xl transition-all duration-300 group/btn shadow-sm"
                                title="Delete Campaign"
                            >
                                <HiOutlineTrash size={22} className="group-hover/btn:scale-110 transition-transform" />
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-[40px] p-20 text-center">
                        <p className="text-gray-400 font-black uppercase tracking-widest mb-6">No Active Ad Campaigns Found</p>
                        <Link 
                            to="/dashboard/add-ad"
                            className="inline-flex items-center gap-3 bg-white border border-gray-200 text-gray-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-sm hover:border-indigo-600 hover:text-indigo-600"
                        >
                            Launch First Campaign
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageAds;
