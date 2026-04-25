import {
  FaUserCircle,
  FaClock,
  FaStar,
  FaRegStar,
  FaFacebook,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import { formatDate } from "../../../utility/DateFormat";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n";
import BannerAd from "../../../Component/BannerAd";

const socialICONS = [
  {
    name: "Facebook",
    icon: <FaFacebook />,
    color: "hover:bg-[#1877F2] hover:shadow-[#1877F2]/30",
  },
  {
    name: "Twitter",
    icon: <FaTwitter />,
    color: "hover:bg-[#1DA1F2] hover:shadow-[#1DA1F2]/30",
  },
  {
    name: "Instagram",
    icon: <FaInstagram />,
    color: "hover:bg-[#E4405F] hover:shadow-[#E4405F]/30",
  },
];

const SingleBlogCard = ({ blog }) => {
  const {
    title,
    description,
    content,
    coverImg,
    category,
    rating,
    author,
    createdAt,
  } = blog || {};
  const { t } = useTranslation();

  return (
    <div className="bg-white">
      {/* Article Cover Image */}
      <div className="w-full overflow-hidden rounded-2xl md:rounded-[32px] shadow-sm mb-6">
        <img
          src={coverImg}
          alt={title}
          className="w-full h-auto object-cover max-h-[700px]"
        />
      </div>

      <div className="px-4 md:px-12">
        {/* Article Header Info - Tightened Spacing */}
        <div className="max-w-4xl mb-8">
          {category && (
            <span className="bg-orange-600 text-white text-[9px] md:text-[10px] font-outfit font-black uppercase tracking-[0.2em] px-4 md:px-5 py-2 rounded-full mb-4 inline-block shadow-lg">
              {category}
            </span>
          )}
          <h1 className="text-2xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 md:mb-6 leading-[1.1] tracking-tight">
            {i18n.language === "bn" ? blog.title_bn || title : title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-gray-500 text-xs font-bold uppercase tracking-widest border-y border-gray-100 py-5">
            <div className="flex items-center gap-2">
              {author?.profileImage ? (
                <img
                  src={author.profileImage}
                  alt={author.username}
                  className="w-6 h-6 rounded-full object-cover border border-orange-100 shadow-sm"
                />
              ) : (
                <FaUserCircle className="text-orange-600 w-5 h-5" />
              )}
              <span className="text-gray-900 font-outfit font-black">
                {t("by")} {author?.username || t("combatStaff")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaClock className="text-gray-400 w-4 h-4" />
              <span>{formatDate(createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-orange-600 rounded-full" />
              <span>12 {t("minRead")}</span>
            </div>
          </div>
        </div>

        {/* Blog Content Layout - Grid for Sidebar Ad */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16">
          <div className="lg:col-span-8">
            {(description ||
              (i18n.language === "bn" && blog.description_bn)) && (
              <div className="mb-12 p-8 bg-orange-50/50 rounded-[32px] border-l-8 border-orange-600 shadow-sm">
                <p className="text-xl md:text-2xl text-gray-800 font-extrabold italic leading-relaxed">
                  {i18n.language === "bn"
                    ? blog.description_bn || description
                    : description}
                </p>
              </div>
            )}

            <div
              dangerouslySetInnerHTML={{
                __html: String(
                  (i18n.language === "bn"
                    ? blog.content_bn || content
                    : content) || "",
                )
                  .replace(/&lt;/g, "<")
                  .replace(/&gt;/g, ">")
                  .replace(/&amp;/g, "&")
                  .replace(/&quot;/g, '"')
                  .replace(/&#39;/g, "'")
                  .replace(/&nbsp;/g, " ")
                  // Super Cleanup: Strip wrapper paragraphs even with whitespace/nbsp
                  .replace(
                    /<p>\s*<(h1|h2|h3|h4|h5|h6|ul|ol|li|blockquote|hr|p|iframe|video)/g,
                    "<$1",
                  )
                  .replace(
                    /<\/(h1|h2|h3|h4|h5|h6|ul|ol|li|blockquote|hr|p|iframe|video)>\s*<\/p>/g,
                    "</$1>",
                  )
                  // Remove any remaining empty paragraphs
                  .replace(/<p>\s*<\/p>/g, ""),
              }}
              className="quill-content ql-editor prose prose-lg md:prose-xl max-w-none text-gray-800 leading-relaxed mb-12"
            />

            {/* IN-ARTICLE BANNER AD */}
            <BannerAd
              slot="horizontal"
              className="my-12 opacity-80 hover:opacity-100 transition-opacity"
            />

            {/* Article Footer / Rating */}
            <div className="mt-16 pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-4 bg-gray-50 px-6 py-4 rounded-2xl">
                <div className="flex gap-1 text-orange-500">
                  {[...Array(5)].map((_, i) =>
                    i < Math.floor(rating || 0) ? (
                      <FaStar key={i} />
                    ) : (
                      <FaRegStar key={i} />
                    ),
                  )}
                </div>
                <div className="h-6 w-[1px] bg-gray-200" />
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-outfit font-black text-gray-900">
                    {rating || "0.0"}
                  </span>
                  <span className="text-xs font-outfit font-bold text-gray-400 uppercase tracking-widest">
                    {t("articleImpact")}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-[10px] font-outfit font-black uppercase tracking-[0.2em] text-gray-400">
                  {t("shareStory")}
                </span>
                <div className="flex gap-3">
                  {socialICONS.map((social) => (
                    <button
                      key={social.name}
                      onClick={() => {
                        const url = window.location.href;
                        navigator.clipboard.writeText(url);
                        alert(t("linkCopied"));
                      }}
                      className={`w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-xl text-gray-400 hover:text-white transition-all duration-300 shadow-sm hover:-translate-y-1 active:scale-90 ${social.color}`}
                      title={`Copy link for ${social.name}`}
                    >
                      {social.icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SIDEBAR AD SLOT */}
          <aside className="lg:col-span-4 sticky top-32 h-fit space-y-8">
            <BannerAd
              slot="sidebar"
              className="shadow-2xl shadow-orange-600/5"
            />

            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
              <h4 className="text-[10px] font-outfit font-black uppercase tracking-[0.3em] text-orange-600 mb-4">
                {t("newsletterTitle")}
              </h4>
              <p className="text-sm font-bold text-gray-900 mb-6 leading-tight">
                {t("newsletterDesc")}
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3 text-sm font-medium outline-none focus:border-orange-600 transition-colors"
                />
                <button className="w-full bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest py-4 rounded-xl hover:bg-orange-600 transition-colors shadow-lg active:scale-95">
                  {t("subscribe")}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default SingleBlogCard;
