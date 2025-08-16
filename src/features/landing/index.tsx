
import { Link, useNavigate } from "@tanstack/react-router";
import React, { useEffect } from "react";

const Landing: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => {
      const token = sessionStorage.getItem('token')
      token == null ? null : navigate({ to: '/' })
    }, [navigate])


    return (
        <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
            {/* Header */}
            <header className="w-full bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center p-4 gap-4">
                    <div className="flex items-center">
                        <img src="https://i.postimg.cc/qv4hC73K/logo.png" alt="Emporium" className="w-12 h-12" />
                        <div className="text-gray-900 text-xl font-bold ml-3">BuyBox Seller Centre</div>
                    </div>
                    <div className="hidden md:flex items-center bg-[#f0fdf4] text-[#166534] px-4 py-2 rounded-full">
                        <span className="text-sm font-medium"> Sell local, sell national, sell from home.</span>
                    </div>

                    <div className="flex gap-4 items-center">
                        <Link to="/sign-in" className="text-gray-900 font-medium hover:underline">Log in</Link>
                        <Link to="/sign-in" className="bg-[#ff9900] hover:bg-[#ff9900]/90 text-white px-6 py-2 rounded-full font-medium">
                            Sign up
                        </Link>
                    </div>
                </div>
            </header>
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 py-12 lg:py-14">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                        <div className="lg:w-1/2 text-center lg:text-left">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl text-gray-900 font-bold">
                                Join BuyBox and start selling today
                            </h1>
                            <div className="flex justify-center lg:justify-start items-center gap-4 mt-6">
                                <Link to="/sign-in" className="bg-[#ff9900] hover:bg-[#ff9900]/90 text-white px-8 py-3 rounded-full font-medium text-lg">
                                    Create a Seller Account
                                </Link>
                            </div>
                        </div>

                        <div className="w-full lg:w-1/2 flex justify-center items-center mt-8 lg:mt-0">
                            <img
                                src="https://i.postimg.cc/MpkpJ3gW/image.png"
                                alt="Main image"
                                className="w-full max-w-md lg:max-w-lg rounded-lg shadow-lg"
                            />
                        </div>
                    </div>
                </div>

                {/* Why Choose Section */}
                <div className="bg-white py-12 lg:py-16">
                    <div className="max-w-7xl mx-auto px-4">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center lg:text-left">
                            Why Choose BuyBox?
                        </h2>
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-4">
                                <div className="w-12 h-12 bg-[#f0fdf4] rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-[#166534]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">Easy-to-use seller tools</h3>
                                <p className="text-gray-600">Manage your store effectively with our comprehensive toolkit for listing, pricing, and promoting products.</p>
                            </div>

                            <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-4">
                                <div className="w-12 h-12 bg-[#f0fdf4] rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-[#166534]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">Integrated analytics</h3>
                                <p className="text-gray-600">Monitor your sales performance with real-time analytics and insights.</p>
                            </div>

                            <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-4">
                                <div className="w-12 h-12 bg-[#f0fdf4] rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-[#166534]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">Reliable delivery network</h3>
                                <p className="text-gray-600">Ensure smooth logistics with our trusted delivery partners.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="text-gray-600 body-font">
                <div className="container px-5 py-5 mx-auto flex items-center sm:flex-row flex-col">
                    <a className="flex title-font font-medium items-center md:justify-start justify-center text-white">
                        <span className="text-xl font-bold text-gray-900">BuyBox</span>
                    </a>
                    <p className="text-sm text-gray-900 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
                        © 2024 buybox —
                        <Link
                        to={'/'}
                            className="text-gray-900 ml-1"
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            @buybox
                        </Link>
                    </p>
                    <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
                        {/* <a className="text-gray-100 cursor-pointer">
                            <svg
                                fill="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                className="w-5 h-5"
                                viewBox="0 0 24 24"
                            >
                                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                            </svg>
                        </a> */}
                        <a target="_blank" className=" text-gray-900 cursor-pointer" href="https://wa.me/message/QN7JS5BO577VF1">
                            <svg
                                fill="currentColor"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={0}
                                className="w-5 h-5"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke="none"
                                    d="M 12.011719 2 C 6.5057187 2 2.0234844 6.478375 2.0214844 11.984375 C 2.0204844 13.744375 2.4814687 15.462563 3.3554688 16.976562 L 2 22 L 7.2324219 20.763672 C 8.6914219 21.559672 10.333859 21.977516 12.005859 21.978516 L 12.009766 21.978516 C 17.514766 21.978516 21.995047 17.499141 21.998047 11.994141 C 22.000047 9.3251406 20.962172 6.8157344 19.076172 4.9277344 C 17.190172 3.0407344 14.683719 2.001 12.011719 2 z M 12.009766 4 C 14.145766 4.001 16.153109 4.8337969 17.662109 6.3417969 C 19.171109 7.8517969 20.000047 9.8581875 19.998047 11.992188 C 19.996047 16.396187 16.413812 19.978516 12.007812 19.978516 C 10.674812 19.977516 9.3544062 19.642812 8.1914062 19.007812 L 7.5175781 18.640625 L 6.7734375 18.816406 L 4.8046875 19.28125 L 5.2851562 17.496094 L 5.5019531 16.695312 L 5.0878906 15.976562 C 4.3898906 14.768562 4.0204844 13.387375 4.0214844 11.984375 C 4.0234844 7.582375 7.6067656 4 12.009766 4 z M 8.4765625 7.375 C 8.3095625 7.375 8.0395469 7.4375 7.8105469 7.6875 C 7.5815469 7.9365 6.9355469 8.5395781 6.9355469 9.7675781 C 6.9355469 10.995578 7.8300781 12.182609 7.9550781 12.349609 C 8.0790781 12.515609 9.68175 15.115234 12.21875 16.115234 C 14.32675 16.946234 14.754891 16.782234 15.212891 16.740234 C 15.670891 16.699234 16.690438 16.137687 16.898438 15.554688 C 17.106437 14.971687 17.106922 14.470187 17.044922 14.367188 C 16.982922 14.263188 16.816406 14.201172 16.566406 14.076172 C 16.317406 13.951172 15.090328 13.348625 14.861328 13.265625 C 14.632328 13.182625 14.464828 13.140625 14.298828 13.390625 C 14.132828 13.640625 13.655766 14.201187 13.509766 14.367188 C 13.363766 14.534188 13.21875 14.556641 12.96875 14.431641 C 12.71875 14.305641 11.914938 14.041406 10.960938 13.191406 C 10.218937 12.530406 9.7182656 11.714844 9.5722656 11.464844 C 9.4272656 11.215844 9.5585938 11.079078 9.6835938 10.955078 C 9.7955938 10.843078 9.9316406 10.663578 10.056641 10.517578 C 10.180641 10.371578 10.223641 10.267562 10.306641 10.101562 C 10.389641 9.9355625 10.347156 9.7890625 10.285156 9.6640625 C 10.223156 9.5390625 9.737625 8.3065 9.515625 7.8125 C 9.328625 7.3975 9.131125 7.3878594 8.953125 7.3808594 C 8.808125 7.3748594 8.6425625 7.375 8.4765625 7.375 z"
                                />
                            </svg>
                          
                        </a>
                        <a target="_blank" className="ml-3 text-gray-900 cursor-pointer">
                            <svg
                                fill="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                className="w-5 h-5"
                                viewBox="0 0 24 24"
                            >
                                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                            </svg>
                        </a>
                        <a target="_blank" className="ml-3 text-gray-900 cursor-pointer" href="https://www.instagram.com/emporium.ecom/profilecard/?igsh=NzlzamdhZnQyamtl">
                            <svg
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                className="w-5 h-5"
                                viewBox="0 0 24 24"
                            >
                                <rect width={20} height={20} x={2} y={2} rx={5} ry={5} />
                                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01" />
                            </svg>
                        </a>
                        <a target="_blank" className="ml-3 text-gray-900 cursor-pointer" href="https://www.linkedin.com/in/emporium-inc-684129342/overlay/about-this-profile/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base%3BXv4DuLj6TEqjaSqJmrkMMQ%3D%3D">
                            <svg
                                fill="currentColor"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={0}
                                className="w-5 h-5"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke="none"
                                    d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
                                />
                                <circle cx={4} cy={4} r={2} stroke="none" />
                            </svg>
                        </a>
                        
                    </span>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
