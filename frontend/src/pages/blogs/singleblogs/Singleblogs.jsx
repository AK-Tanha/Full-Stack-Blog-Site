import { useParams } from 'react-router-dom';
import { useFetchBlogsByIDQuery } from '../../../redux/features/blogs/blogsApi';
import { useTranslation } from 'react-i18next';
import CommentsCard from '../Comments/CommentsCard';
import RelatedBlogs from './RelatedBlogs';
import SingleBlogCard from './SingleBlogCard';
import Loading from '../../../Component/Loading';
import BannerAd from '../../../Component/BannerAd';
import SEO from '../../../Component/SEO';
import i18n from '../../../i18n';

const Singleblogs = () => {
  const { id } = useParams(); 
  const { data: blog, error, isLoading } = useFetchBlogsByIDQuery(id); 
  const { t } = useTranslation();

  const blogPost = blog?.post;
  const displayTitle = i18n.language === "bn" ? blogPost?.title_bn || blogPost?.title : blogPost?.title;
  const displayDescription = i18n.language === "bn" ? blogPost?.description_bn || blogPost?.description : blogPost?.description;

  return (
    <div className="bg-gray-50 min-h-screen pt-12 pb-24">
      {blogPost && (
        <SEO 
          title={displayTitle}
          description={displayDescription}
          image={blogPost.coverImg}
          url={`/blogs/${id}`}
          type="article"
        />
      )}
      <div className="container mx-auto px-6 max-w-7xl">
        {isLoading && (
          <div className="flex justify-center items-center py-40">
            <Loading />
          </div>
        )}

        {error && (
          <div className="bg-orange-50 text-orange-600 p-10 rounded-3xl border border-orange-100 text-center shadow-inner max-w-2xl mx-auto">
            <p className="font-black text-2xl mb-4 uppercase tracking-tighter">{t('somethingWentWrong')}</p>
            <p className="text-sm font-medium opacity-80">{error?.data?.message || t('errorLoadingArticle')}</p>
          </div>
        )}

        {blog?.post && (
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Main Article Content */}
            <div className="w-full lg:w-[68%]">
              <article className="shadow-2xl shadow-gray-200/50 rounded-[40px] overflow-hidden">
                <SingleBlogCard blog={blog.post} />
              </article>

              {/* Ad Placement before Comments */}
              <BannerAd 
                slot="horizontal" 
                category={blog?.post?.category} 
                className="mt-12 opacity-80 hover:opacity-100 transition-opacity" 
              />

              <div className="mt-16">
                <div className="flex items-center gap-4 mb-10">
                  <h3 className="text-2xl font-black uppercase tracking-tight text-gray-900 px-5 py-2 bg-orange-50 border-orange-600 border-l-8 shadow-sm">
                    {t('readerComments')}
                  </h3>
                  <div className="h-[2px] flex-grow bg-gray-100"></div>
                </div>
                <CommentsCard comments={blog?.comments} />
              </div>
            </div>

            {/* Sticky Sidebar */}
            <div className="w-full lg:w-[32%]">
              <div className="sticky top-32 space-y-10">
                <BannerAd
                  slot="sidebar"
                  category={blog?.post?.category}
                  className="opacity-80 hover:opacity-100 transition-opacity"
                />

                <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl shadow-gray-200/40">
                  <div className="flex items-center gap-4 mb-8">
                    <h3 className="text-xl font-black uppercase tracking-tight text-gray-900 px-4 py-1.5 bg-amber-50 border-amber-500 border-l-4">
                      {t('relatedNews')}
                    </h3>
                    <div className="h-[1px] flex-grow bg-gray-100"></div>
                  </div>
                  <RelatedBlogs />
                </div>

                {/* Newsletter Sidebar Block */}
                <div className="bg-gray-900 rounded-[32px] p-8 text-white relative overflow-hidden group shadow-2xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/20 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-orange-600/40 transition-colors" />
                  <h4 className="text-xl font-black uppercase tracking-tighter mb-4 relative z-10">{t('getHeadlines')}</h4>
                  <p className="text-gray-400 text-sm mb-6 relative z-10 font-medium">{t('newsletterDesc')}</p>
                  <div className="relative z-10 space-y-3">
                    <input type="email" placeholder={t('enterEmail')} className="w-full bg-white/10 border border-white/10 rounded-xl px-5 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors" />
                    <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest text-xs py-4 rounded-xl shadow-lg shadow-orange-900/20 transition-all active:scale-95">{t('subscribe')}</button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Singleblogs;
