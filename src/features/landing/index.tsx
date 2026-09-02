import { Link, useNavigate } from "@tanstack/react-router";
import React, { useEffect } from "react";
import { HiOutlineChartBar, HiOutlineTruck, HiOutlineAdjustments } from "react-icons/hi";

const Landing: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const token = sessionStorage.getItem('token')
        if (token) navigate({ to: '/' })
    }, [navigate])

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 relative selection:bg-orange-500/30">
            {/* Ambient Background Effects */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-orange-200/20 blur-[120px]" />
                <div className="absolute top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-blue-200/20 blur-[120px]" />
            </div>

            {/* Glassmorphic Header */}
            <header className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-md border-b border-white/40 shadow-sm transition-all">
                <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <img src="https://i.postimg.cc/qv4hC73K/logo.png" alt="BuyBox" className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-sm" />
                        <span className="text-slate-900 text-lg sm:text-xl font-black tracking-tight">BuyBox Seller</span>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-6">
                        <Link to="/sign-in" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors hidden sm:block">
                            Log in
                        </Link>
                        <Link to="/sign-in" className="text-xs sm:text-sm font-bold bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-full shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all hover:-translate-y-0.5 active:translate-y-0">
                            Start Selling
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-grow relative z-10 pt-28 pb-20">
                {/* Hero Section */}
                <div className="max-w-7xl mx-auto px-6 pt-12 lg:pt-24 pb-20">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8">
                        <div className="lg:w-[55%] text-center lg:text-left flex flex-col items-center lg:items-start">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/50 border border-orange-200/50 text-orange-700 font-medium text-sm mb-6 shadow-sm">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                                </span>
                                Now accepting new sellers
                            </div>
                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-[1.1] mb-6">
                                Sell smarter, <br className="hidden sm:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">
                                    grow faster.
                                </span>
                            </h1>
                            <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed font-medium">
                                Join the fastest-growing marketplace. Get access to millions of customers, powerful analytics, and seamless logistics—all from a single dashboard.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                                <Link to="/sign-in" className="w-full sm:w-auto text-center bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 transition-all hover:-translate-y-1">
                                    Create Seller Account
                                </Link>
                                <Link to="/sign-in" className="w-full sm:w-auto text-center bg-white hover:bg-slate-50 text-slate-700 px-8 py-4 rounded-full font-bold text-lg shadow-sm border border-slate-200 hover:border-slate-300 transition-all">
                                    View Pricing
                                </Link>
                            </div>
                            
                            <div className="mt-12 flex items-center gap-8 opacity-70 grayscale">
                                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Trusted By</span>
                                <div className="flex gap-6 items-center">
                                    <div className="font-serif font-bold text-xl text-slate-800">L'Oréal</div>
                                    <div className="font-sans font-black text-xl text-slate-800">Nike</div>
                                    <div className="font-mono font-bold text-xl text-slate-800">Sony</div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full lg:w-[45%] relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-blue-500/20 rounded-3xl blur-2xl transform rotate-3 scale-105"></div>
                            <div className="relative rounded-3xl bg-white/40 p-2 backdrop-blur-xl border border-white/50 shadow-2xl">
                                <img
                                    src="https://i.postimg.cc/MpkpJ3gW/image.png"
                                    alt="Seller Dashboard Preview"
                                    className="w-full rounded-2xl shadow-sm border border-slate-100"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bento Box Features Section */}
                <div className="max-w-7xl mx-auto px-6 py-20 relative">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
                            Everything you need to scale
                        </h2>
                        <p className="text-lg text-slate-600 font-medium">
                            Our seller platform is engineered to remove friction, so you can focus on what matters most—building your brand.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Feature 1 */}
                        <div className="group relative bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-orange-500/5 hover:border-orange-100 transition-all duration-300 hover:-translate-y-1">
                            <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-orange-100 transition-all duration-300">
                                <HiOutlineAdjustments className="w-7 h-7 text-orange-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">Frictionless Management</h3>
                            <p className="text-slate-600 leading-relaxed font-medium">
                                Upload products in bulk, manage variants with our smart tagging system, and instantly sync inventory across channels.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="group relative bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-blue-500/5 hover:border-blue-100 transition-all duration-300 hover:-translate-y-1">
                            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-300">
                                <HiOutlineChartBar className="w-7 h-7 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">Real-time Intelligence</h3>
                            <p className="text-slate-600 leading-relaxed font-medium">
                                Understand your customers deeply. Monitor live sales, track conversion rates, and optimize your pricing dynamically.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="group relative bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-green-500/5 hover:border-green-100 transition-all duration-300 hover:-translate-y-1">
                            <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-green-100 transition-all duration-300">
                                <HiOutlineTruck className="w-7 h-7 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">Flawless Fulfillment</h3>
                            <p className="text-slate-600 leading-relaxed font-medium">
                                Tap into our nationwide delivery network. Generate labels in one click and offer customers guaranteed 2-day shipping.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Premium Footer */}
            <footer className="bg-white border-t border-slate-200 py-12 relative z-10">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <img src="https://i.postimg.cc/qv4hC73K/logo.png" alt="BuyBox" className="w-8 h-8 object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all" />
                        <span className="text-slate-900 text-lg font-bold tracking-tight">BuyBox</span>
                    </div>
                    <p className="text-sm font-medium text-slate-500">
                        © {new Date().getFullYear()} BuyBox Marketplace. All rights reserved.
                    </p>
                    <div className="flex items-center gap-5">
                        <a href="https://wa.me/message/QN7JS5BO577VF1" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900 transition-colors">
                            <span className="sr-only">WhatsApp</span>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path stroke="none" d="M12.011719 2C6.5057187 2 2.0234844 6.478375 2.0214844 11.984375C2.0204844 13.744375 2.4814687 15.462563 3.3554688 16.976562L2 22L7.2324219 20.763672C8.6914219 21.559672 10.333859 21.977516 12.005859 21.978516L12.009766 21.978516C17.514766 21.978516 21.995047 17.499141 21.998047 11.994141C22.000047 9.3251406 20.962172 6.8157344 19.076172 4.9277344C17.190172 3.0407344 14.683719 2.001 12.011719 2zM12.009766 4C14.145766 4.001 16.153109 4.8337969 17.662109 6.3417969C19.171109 7.8517969 20.000047 9.8581875 19.998047 11.992188C19.996047 16.396187 16.413812 19.978516 12.007812 19.978516C10.674812 19.977516 9.3544062 19.642812 8.1914062 19.007812L7.5175781 18.640625L6.7734375 18.816406L4.8046875 19.28125L5.2851562 17.496094L5.5019531 16.695312L5.0878906 15.976562C4.3898906 14.768562 4.0204844 13.387375 4.0214844 11.984375C4.0234844 7.582375 7.6067656 4 12.009766 4zM8.4765625 7.375C8.3095625 7.375 8.0395469 7.4375 7.8105469 7.6875C7.5815469 7.9365 6.9355469 8.5395781 6.9355469 9.7675781C6.9355469 10.995578 7.8300781 12.182609 7.9550781 12.349609C8.0790781 12.515609 9.68175 15.115234 12.21875 16.115234C14.32675 16.946234 14.754891 16.782234 15.212891 16.740234C15.670891 16.699234 16.690438 16.137687 16.898438 15.554688C17.106437 14.971687 17.106922 14.470187 17.044922 14.367188C16.982922 14.263188 16.816406 14.201172 16.566406 14.076172C16.317406 13.951172 15.090328 13.348625 14.861328 13.265625C14.632328 13.182625 14.464828 13.140625 14.298828 13.390625C14.132828 13.640625 13.655766 14.201187 13.509766 14.367188C13.363766 14.534188 13.21875 14.556641 12.96875 14.431641C12.71875 14.305641 11.914938 14.041406 10.960938 13.191406C10.218937 12.530406 9.7182656 11.714844 9.5722656 11.464844C9.4272656 11.215844 9.5585938 11.079078 9.6835938 10.955078C9.7955938 10.843078 9.9316406 10.663578 10.056641 10.517578C10.180641 10.371578 10.223641 10.267562 10.306641 10.101562C10.389641 9.9355625 10.347156 9.7890625 10.285156 9.6640625C10.223156 9.5390625 9.737625 8.3065 9.515625 7.8125C9.328625 7.3975 9.131125 7.3878594 8.953125 7.3808594C8.808125 7.3748594 8.6425625 7.375 8.4765625 7.375z"/></svg>
                        </a>
                        <a href="https://www.instagram.com/emporium.ecom/" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900 transition-colors">
                            <span className="sr-only">Instagram</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <rect width={20} height={20} x={2} y={2} rx={5} ry={5} />
                                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01" />
                            </svg>
                        </a>
                        <a href="https://www.linkedin.com/in/emporium-inc-684129342/" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900 transition-colors">
                            <span className="sr-only">LinkedIn</span>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path stroke="none" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                                <circle cx={4} cy={4} r={2} stroke="none" />
                            </svg>
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
