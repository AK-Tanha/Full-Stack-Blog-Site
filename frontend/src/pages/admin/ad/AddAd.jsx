import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateAdMutation, useFetchAdByIdQuery, useUpdateAdMutation } from '../../../redux/features/ads/adsApi';
import { HiOutlineCloudUpload, HiOutlineTicket, HiOutlineExternalLink, HiOutlinePhotograph, HiOutlineTypeSpecimen } from 'react-icons/hi';

const AddAd = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [createAd, { isLoading: isCreating }] = useCreateAdMutation();
    const [updateAd, { isLoading: isUpdating }] = useUpdateAdMutation();
    const { data: adData, isLoading: isLoadingAd } = useFetchAdByIdQuery(id, { skip: !id });

    const [ad, setAd] = useState({
        title: '',
        subtitle: '',
        image: '',
        cta: 'SHOP NOW',
        link: '',
        slot: 'horizontal',
        isActive: true
    });

    useEffect(() => {
        if (adData) {
            setAd(adData);
        }
    }, [adData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAd({
            ...ad,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await updateAd({ id, ...ad }).unwrap();
                alert("Ad updated successfully!");
            } else {
                await createAd(ad).unwrap();
                alert("Ad created successfully!");
            }
            navigate('/dashboard/manage-ads');
        } catch (error) {
            console.error("Failed to save ad:", error);
            alert("Error saving ad. Please try again.");
        }
    };

    if (id && isLoadingAd) return <div className="p-10 text-center font-black uppercase text-indigo-600 animate-pulse">Loading Ad Data...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-10">
                <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-2">
                    {id ? 'Update Advertisement' : 'Create New Ad'}
                </h1>
                <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em]">Campaign Management Center</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 md:p-12 rounded-[40px] shadow-2xl shadow-indigo-100 border border-indigo-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Title */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                            <HiOutlineTypeSpecimen className="text-indigo-600" size={16} />
                            Ad Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={ad.title}
                            onChange={handleChange}
                            required
                            placeholder="e.g. PREMIUM FIGHT GEAR"
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl px-6 py-4 text-sm font-bold transition-all outline-none"
                        />
                    </div>

                    {/* Subtitle */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                            <HiOutlineTicket className="text-indigo-600" size={16} />
                            Subtitle / Offer
                        </label>
                        <input
                            type="text"
                            name="subtitle"
                            value={ad.subtitle}
                            onChange={handleChange}
                            placeholder="e.g. UP TO 40% OFF"
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl px-6 py-4 text-sm font-bold transition-all outline-none"
                        />
                    </div>

                    {/* Image URL */}
                    <div className="space-y-3 md:col-span-2">
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                            <HiOutlinePhotograph className="text-indigo-600" size={16} />
                            Banner Image URL
                        </label>
                        <div className="flex gap-4">
                            <input
                                type="text"
                                name="image"
                                value={ad.image}
                                onChange={handleChange}
                                required
                                placeholder="Paste image link here..."
                                className="flex-1 bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl px-6 py-4 text-sm font-bold transition-all outline-none"
                            />
                        </div>
                        {ad.image && (
                            <div className="mt-4 rounded-3xl overflow-hidden border-4 border-indigo-50 shadow-inner">
                                <img src={ad.image} alt="Preview" className="w-full h-40 object-cover" />
                            </div>
                        )}
                    </div>

                    {/* CTA Text */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                            <HiOutlinePlusCircle className="text-indigo-600" size={16} />
                            CTA Button Text
                        </label>
                        <input
                            type="text"
                            name="cta"
                            value={ad.cta}
                            onChange={handleChange}
                            placeholder="e.g. SHOP NOW"
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl px-6 py-4 text-sm font-bold transition-all outline-none"
                        />
                    </div>

                    {/* Link URL */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                            <HiOutlineExternalLink className="text-indigo-600" size={16} />
                            Target Link (URL)
                        </label>
                        <input
                            type="text"
                            name="link"
                            value={ad.link}
                            onChange={handleChange}
                            required
                            placeholder="https://..."
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl px-6 py-4 text-sm font-bold transition-all outline-none"
                        />
                    </div>

                    {/* Slot Type */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                            <HiOutlineViewGrid className="text-indigo-600" size={16} />
                            Ad Placement Slot
                        </label>
                        <select
                            name="slot"
                            value={ad.slot}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl px-6 py-4 text-sm font-black uppercase transition-all outline-none cursor-pointer"
                        >
                            <option value="horizontal">Horizontal (728x90)</option>
                            <option value="masthead">Masthead (Header)</option>
                            <option value="sidebar">Sidebar (Square)</option>
                            <option value="mobile">Mobile (320x50)</option>
                        </select>
                    </div>

                    {/* Active Toggle */}
                    <div className="flex items-center gap-4 px-6 py-4 bg-gray-50 rounded-2xl">
                        <label className="flex-1 text-sm font-black uppercase text-gray-700 cursor-pointer" htmlFor="isActive">
                            Active Campaign
                        </label>
                        <input
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            checked={ad.isActive}
                            onChange={handleChange}
                            className="w-6 h-6 rounded-lg border-2 border-gray-300 text-indigo-600 focus:ring-indigo-600 transition-all cursor-pointer"
                        />
                    </div>
                </div>

                <div className="pt-8">
                    <button
                        type="submit"
                        disabled={isCreating || isUpdating}
                        className="w-full bg-gray-900 hover:bg-indigo-600 text-white font-black uppercase tracking-widest py-6 rounded-[28px] transition-all duration-300 shadow-xl hover:shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-50"
                    >
                        {isCreating || isUpdating ? 'Processing...' : (id ? 'Update Advertisement' : 'Launch Ad Campaign')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddAd;
