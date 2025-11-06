import { Progress } from "@radix-ui/react-progress";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";

export default function Admin() {
  const location = useLocation();
  const navigate = useNavigate();
  const activetoken = sessionStorage.getItem('token');
  const queryParams = new URLSearchParams(location.search);
  const token = activetoken ? activetoken : queryParams.get('accessToken');
  const baseUrl = import.meta.env.VITE_BASE_URL as string;
  const [loading, setLoading] = useState(true);
  const [showAgreement, setShowAgreement] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const agreementRef = useRef<HTMLDivElement>(null);

  const getBrand = async () => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/brand/get-my-brand`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
   // console.log(data);
    sessionStorage.setItem('brand', JSON.stringify(data.brand));
  }

  const handleScroll = () => {
    if (agreementRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = agreementRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setHasScrolledToBottom(true);
      }
    }
  };

  const handleAgree = async () => {
    sessionStorage.setItem("isAuthenticated", "true");
    navigate({ to: '/create-brand' });
  };

  useEffect(() => {
    if (!token) {
      navigate({ to: '/sign-in' });
      return;
    }

    const fetchSellerDetails = async () => {
      try {
        const response = await fetch(`${baseUrl}/seller/profile/get-details`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });

        const data = await response.json();
       // console.log('Seller details:', data);
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', JSON.stringify(data.seller));
        
        if (data.seller.isCompleted === false) {
          setShowAgreement(true);
          setLoading(false);
        } else {
          sessionStorage.setItem("isLoggedIn", "true");
          await getBrand();
          navigate({ to: '/' });
        }
      } catch (error) {
        //console.error('Error fetching seller details:', error);
        navigate({ to: '/500' });
      }
    };

    fetchSellerDetails();
  }, [token, navigate]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Progress /></div>;
  }

  if (showAgreement) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">BuyBox Seller Agreement</h1>
        <p className="mb-4">Please read and agree to the following terms before continuing:</p>
        
        <div 
          ref={agreementRef}
          onScroll={handleScroll}
          className="border p-4 mb-6 h-96 overflow-y-auto bg-gray-50"
        >
          <h2 className="text-xl font-bold mb-4">BUYBOX SELLER AGREEMENT</h2>
          <p className="mb-4">This BuyBox Seller Agreement ("Agreement") is made and entered into by and between BuyBox
          ("BuyBox," "we," "us," or "our") and you ("Seller," "you," or "your"). By registering as a seller on
          BuyBox and listing products for sale, you agree to comply with the terms outlined in this
          Agreement.</p>
          
          <h3 className="text-lg font-bold mt-6 mb-2">1. DEFINITIONS</h3>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-1">● "Platform" refers to BuyBox's online marketplace.</li>
            <li className="mb-1">● "Seller" refers to any individual or business that lists and sells products through BuyBox.</li>
            <li className="mb-1">● "Buyer" refers to any individual or business purchasing products through BuyBox.</li>
            <li className="mb-1">● "Commission" refers to the percentage fee BuyBox collects from each sale.</li>
            <li className="mb-1">● "Fulfillment" refers to the process of packing and delivering products to Buyers.</li>
            <li className="mb-1">● "Intellectual Property" refers to trademarks, copyrights, and other proprietary rights.</li>
          </ul>

          <h3 className="text-lg font-bold mt-6 mb-2">2. SELLER REGISTRATION & ACCOUNT</h3>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-1">● You must register with BuyBox and provide accurate business and financial information.</li>
            <li className="mb-1">● You are responsible for maintaining the security of your account.</li>
            <li className="mb-1">● BuyBox reserves the right to approve or reject any seller registration.</li>
          </ul>

          <h3 className="text-lg font-bold mt-6 mb-2">3. LISTING & SELLING PRODUCTS</h3>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-1">● You must provide accurate product descriptions, pricing, and images.</li>
            <li className="mb-1">● All listings must comply with applicable laws and BuyBox's policies.</li>
            <li className="mb-1">● You are responsible for inventory management and ensuring products are in stock.</li>
          </ul>

          <h3 className="text-lg font-bold mt-6 mb-2">4. COMMISSION & FEES</h3>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-1">● BuyBox will collect a commission on each sale, which will be deducted before payouts.</li>
            <li className="mb-1">● The commission percentage will be communicated upon registration and may be updated with prior notice.</li>
            <li className="mb-1">● Additional service fees may apply for fulfillment, advertising, or other services.</li>
          </ul>

          <h3 className="text-lg font-bold mt-6 mb-2">5. ORDER PROCESSING & FULFILLMENT</h3>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-1">● You must process and ship orders within the agreed-upon timeframe.</li>
            <li className="mb-1">● BuyBox may facilitate deliveries through independent delivery agents.</li>
            <li className="mb-1">● You are responsible for packaging and ensuring safe delivery of products unless using BuyBox's fulfillment services.</li>
          </ul>

          <h3 className="text-lg font-bold mt-6 mb-2">6. RETURNS, REFUNDS & CUSTOMER SERVICE</h3>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-1">● You must comply with BuyBox's return and refund policy.</li>
            <li className="mb-1">● You are responsible for handling customer inquiries and complaints regarding your products.</li>
            <li className="mb-1">● BuyBox reserves the right to issue refunds on your behalf if necessary.</li>
          </ul>

          <h3 className="text-lg font-bold mt-6 mb-2">7. PAYMENTS & SETTLEMENTS</h3>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-1">● Payouts will be made to your registered bank or mobile wallet account after deducting commissions and fees.</li>
            <li className="mb-1">● Payment processing timelines will be communicated and may vary based on order completion and returns.</li>
            <li className="mb-1">● BuyBox reserves the right to withhold payments for investigations related to fraud or policy violations.</li>
          </ul>

          <h3 className="text-lg font-bold mt-6 mb-2">8. PROHIBITED PRODUCTS & ACTIVITIES</h3>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-1">● You may not sell counterfeit, illegal, or restricted items.</li>
            <li className="mb-1">● You may not engage in fraudulent or deceptive practices.</li>
            <li className="mb-1">● Violation of these policies may result in account suspension or termination.</li>
          </ul>

          <h3 className="text-lg font-bold mt-6 mb-2">9. INTELLECTUAL PROPERTY & BRAND USAGE</h3>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-1">● You grant BuyBox a non-exclusive, royalty-free license to use your product images and descriptions for promotional purposes.</li>
            <li className="mb-1">● You may not use BuyBox's name, logo, or branding without prior written consent.</li>
          </ul>

          <h3 className="text-lg font-bold mt-6 mb-2">10. TERMINATION & SUSPENSION</h3>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-1">● BuyBox may suspend or terminate your account if you violate this Agreement or applicable laws.</li>
            <li className="mb-1">● You may close your account at any time, but outstanding orders must still be fulfilled.</li>
            <li className="mb-1">● BuyBox may withhold payments if fraud, policy violations, or unresolved disputes exist.</li>
          </ul>

          <h3 className="text-lg font-bold mt-6 mb-2">11. LIABILITY & INDEMNIFICATION</h3>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-1">● You are solely responsible for your products, including safety, compliance, and warranties.</li>
            <li className="mb-1">● You agree to indemnify BuyBox against any claims, damages, or losses arising from your products or actions.</li>
          </ul>

          <h3 className="text-lg font-bold mt-6 mb-2">12. CHANGES TO THIS AGREEMENT</h3>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-1">● BuyBox may update this Agreement at any time with notice. Continued use of the platform constitutes acceptance of changes.</li>
          </ul>

          <h3 className="text-lg font-bold mt-6 mb-2">13. GOVERNING LAW & DISPUTE RESOLUTION</h3>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-1">● This Agreement is governed by the laws of Zimbabwe.</li>
            <li className="mb-1">● Disputes will be resolved through negotiation, mediation, or arbitration as required by BuyBox.</li>
          </ul>

          <p className="mt-6 font-semibold">By registering as a seller and listing products on BuyBox, you acknowledge that you have read, understood, and agreed to these terms.</p>
        </div>
        
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {hasScrolledToBottom 
              ? "Thank you for reading the agreement." 
              : "Please scroll to the bottom to continue."}
          </p>
          <button
            onClick={handleAgree}
            disabled={!hasScrolledToBottom}
            className={`px-5 py-2 rounded text-white ${
              hasScrolledToBottom 
                ? "bg-blue-600 hover:bg-blue-700" 
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Agree
          </button>
        </div>
      </div>
    );
  }

  return null;
}