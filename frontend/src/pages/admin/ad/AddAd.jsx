import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateAdMutation, useFetchAdByIdQuery, useUpdateAdMutation } from '../../../redux/features/ads/adsApi';
import { useUploadImageMutation } from '../../../redux/features/blogs/blogsApi';
import { useFetchCategoriesQuery } from '../../../redux/features/category/categoryApi';
import { HiOutlinePlusCircle, HiOutlineTicket, HiOutlineExternalLink, HiOutlinePhotograph, HiOutlineHashtag, HiOutlineViewGrid, HiOutlineCloudUpload, HiOutlineX, HiOutlineTag } from 'react-icons/hi';

const AddAd = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [createAd, { isLoading: isCreating }] = useCreateAdMutation();
    const [updateAd, { isLoading: isUpdating }] = useUpdateAdMutation();
    const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
    const { data: adData, isLoading: isLoadingAd } = useFetchAdByIdQuery(id, { skip: !id });
    const { data: categories } = useFetchCategoriesQuery();
    const [showFull, setShowFull] = useState(false);

    const [ad, setAd] = useState({
        title: '',
        title_bn: '',
        subtitle: '',
        subtitle_bn: '',
        image: '',
        cta: 'SHOP NOW',
        link: '',
        slot: 'horizontal',
        category: '',
        isActive: true
    });

    const [activeLang, setActiveLang] = useState('en');

    const [hasInitialized, setHasInitialized] = useState(false);

    useEffect(() => {
        if (adData && !hasInitialized) {
            const actualAd = adData.ad || adData.data || adData;
            if (actualAd) {
                setAd({
                    title: actualAd.title || '',
                    title_bn: actualAd.title_bn || '',
                    subtitle: actualAd.subtitle || '',
                    subtitle_bn: actualAd.subtitle_bn || '',
                    image: actualAd.image || '',
                    cta: actualAd.cta || 'SHOP NOW',
                    link: actualAd.link || '',
                    slot: actualAd.slot || 'horizontal',
                    category: actualAd.category || '',
                    isActive: actualAd.isActive !== undefined ? actualAd.isActive : true
                });
                setHasInitialized(true);
            }
        }
    }, [adData, hasInitialized]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAd({
            ...ad,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const imageFormData = new FormData();
        imageFormData.append('image', file);

        try {
            const response = await uploadImage(imageFormData).unwrap();
            setAd({
                ...ad,
                image: response.url
            });
        } catch (err) {
            console.error('Failed to upload image:', err);
            alert('Failed to upload image. Please try again.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!ad.image) {
                alert("Please upload a banner image!");
                return;
            }

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

            <div className="flex gap-4 mb-8 p-1 bg-gray-100 rounded-2xl w-fit">
                <button
                    type="button"
                    onClick={() => setActiveLang('en')}
                    className={`px-6 py-2 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${activeLang === 'en' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    English
                </button>
                <button
                    type="button"
                    onClick={() => setActiveLang('bn')}
                    className={`px-6 py-2 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${activeLang === 'bn' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Bangla
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 md:p-12 rounded-[40px] shadow-2xl shadow-indigo-100 border border-indigo-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Title */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                            <HiOutlineHashtag className="text-indigo-600" size={16} />
                            Ad Title ({activeLang === 'en' ? 'English' : 'Bangla'})
                        </label>
                        <input
                            type="text"
                            name={activeLang === 'en' ? 'title' : 'title_bn'}
                            value={activeLang === 'en' ? ad.title : ad.title_bn}
                            onChange={handleChange}
                            required={activeLang === 'en'}
                            placeholder={activeLang === 'en' ? "e.g. PREMIUM FIGHT GEAR" : "উদা: প্রিমিয়াম ফাইট গিয়ার"}
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl px-6 py-4 text-sm font-bold transition-all outline-none"
                        />
                    </div>

                    {/* Subtitle */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                            <HiOutlineTicket className="text-indigo-600" size={16} />
                            Subtitle / Offer ({activeLang === 'en' ? 'English' : 'Bangla'})
                        </label>
                        <input
                            type="text"
                            name={activeLang === 'en' ? 'subtitle' : 'subtitle_bn'}
                            value={activeLang === 'en' ? ad.subtitle : ad.subtitle_bn}
                            onChange={handleChange}
                            placeholder={activeLang === 'en' ? "e.g. UP TO 40% OFF" : "উদা: ৪০% পর্যন্ত ছাড়"}
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl px-6 py-4 text-sm font-bold transition-all outline-none"
                        />
                    </div>

                    {/* Banner Image Dropzone */}
                    <div className="space-y-3 md:col-span-2">
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                            <HiOutlinePhotograph className="text-indigo-600" size={16} />
                            Banner Image Asset
                        </label>

                        {ad.image ? (
                            <div className="relative group rounded-[32px] overflow-hidden border-4 border-indigo-50 shadow-2xl aspect-video md:aspect-[21/9]">
                                <img src={ad.image} alt="Ad Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                                    <button
                                        type="button"
                                        onClick={() => setShowFull(true)}
                                        className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all transform hover:scale-110"
                                    >
                                        <HiOutlinePhotograph size={24} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setAd({ ...ad, image: '' })}
                                        className="p-3 bg-rose-500/80 backdrop-blur-md rounded-full text-white hover:bg-rose-600 transition-all transform hover:scale-110"
                                    >
                                        <HiOutlineX size={24} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="adImageUpload"
                                    disabled={isUploading}
                                />
                                <label
                                    htmlFor="adImageUpload"
                                    className={`flex flex-col items-center justify-center w-full aspect-video md:aspect-[21/9] border-4 border-dashed border-gray-100 rounded-[40px] hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer group ${isUploading ? 'opacity-50 cursor-wait' : ''}`}
                                >
                                    {isUploading ? (
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                                            <p className="font-black text-indigo-400 uppercase tracking-widest text-xs">Uploading Visual...</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                                <HiOutlineCloudUpload className="text-4xl text-gray-300 group-hover:text-indigo-500 transition-colors" />
                                            </div>
                                            <p className="font-black text-gray-900 uppercase tracking-[0.2em] text-sm text-center px-4">Drop your Ad Banner or Click</p>
                                            <p className="text-xs text-gray-400 mt-2 font-medium tracking-wide">Supports JPG, PNG, WEBP (Max 5MB)</p>
                                        </>
                                    )}
                                </label>
                            </div>
                        )}

                        {showFull && (
                            <div className="fixed inset-0 bg-indigo-950/95 flex items-center justify-center z-[100] p-10 backdrop-blur-xl" onClick={() => setShowFull(false)}>
                                <img src={ad.image} alt="Full Preview" className="max-w-full max-h-full rounded-[40px] shadow-2xl animate-in fade-in zoom-in duration-300" />
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
                    
                    {/* Category Selection */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                            <HiOutlineTag className="text-indigo-600" size={16} />
                            Target Category (Optional)
                        </label>
                        <select
                            name="category"
                            value={ad.category}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl px-6 py-4 text-sm font-black uppercase transition-all outline-none cursor-pointer"
                        >
                            <option value="">Global (All Categories)</option>
                            {categories && categories.map((cat) => (
                                <option key={cat._id} value={cat.name}>{cat.name}</option>
                            ))}
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
