import { Progress } from "@radix-ui/react-progress";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { PENDING_ORDER_ACTION_KEY } from "@/features/order-action";

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

  const getProfile = async () => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/seller/profile/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
   // console.log(data);
    sessionStorage.setItem('seller', JSON.stringify(data.seller));
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
    navigate({ to: '/create-seller-profile' });
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
          await getProfile();
          // Signed in from a WhatsApp order button: go back to that order instead of the dashboard.
          let pendingOrderAction: string | null = null;
          try {
            pendingOrderAction = localStorage.getItem(PENDING_ORDER_ACTION_KEY);
            localStorage.removeItem(PENDING_ORDER_ACTION_KEY);
          } catch {
            // Storage unavailable: fall through to the dashboard.
          }
          if (pendingOrderAction?.startsWith('/order-action/')) {
            window.location.replace(pendingOrderAction);
            return;
          }
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
        <h1 className="text-2xl font-bold mb-4">Treides Seller Partnership Agreement</h1>
        <p className="mb-4">Please read and agree to the following terms before continuing:</p>
        
        <div 
          ref={agreementRef}
          onScroll={handleScroll}
          className="border p-4 mb-6 h-96 overflow-y-auto bg-gray-50"
        >
          <h2 className="text-xl font-bold mb-4">TREIDES SELLER PARTNERSHIP AGREEMENT</h2>
          <p className="mb-4">Welcome to Treides!</p>
          <p className="mb-4">Treides is a marketplace that connects customers with independent sellers, making online shopping easier, safer and more convenient.</p>
          <p className="mb-4">By joining Treides as a seller, you agree to the following terms and responsibilities.</p>

          <h3 className="text-lg font-bold mt-6 mb-2">1. PRODUCT LISTINGS AND PRESENTATION</h3>
          <p className="mb-2">As a seller on Treides, you are responsible for ensuring that all products listed on the platform are accurately represented.</p>
          <p className="mb-2">You agree to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-1">Upload clear, high-quality images of the actual products you are selling.</li>
            <li className="mb-1">Use clean, attractive and appropriate backgrounds when taking product photographs.</li>
            <li className="mb-1">Ensure images have good lighting and clearly showcase the product.</li>
            <li className="mb-1">Provide accurate product descriptions, sizes, colours and prices.</li>
            <li className="mb-1">Ensure that uploaded images properly represent the product.</li>
          </ul>
          <p className="mb-4">Treides reserves the right to reject or remove product images and listings that do not meet its presentation standards or adequately represent the product.</p>

          <h3 className="text-lg font-bold mt-6 mb-2">2. PRODUCT AVAILABILITY</h3>
          <p className="mb-2">Sellers are responsible for keeping their product listings and stock information up to date.</p>
          <p className="mb-2">You agree to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-1">Update product availability promptly.</li>
            <li className="mb-1">Only accept orders for products you can supply.</li>
            <li className="mb-1">Notify Treides immediately if an ordered product becomes unavailable.</li>
            <li className="mb-1">Ensure that customers receive the exact product they ordered.</li>
          </ul>

          <h3 className="text-lg font-bold mt-6 mb-2">3. CUSTOMER REQUESTS AND COMMUNICATION</h3>
          <p className="mb-2">When a customer requests a product or makes an enquiry through Treides, sellers are expected to respond as quickly as possible.</p>
          <p className="mb-2">You agree to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-1">Respond promptly to customer requests.</li>
            <li className="mb-1">Confirm product availability without unnecessary delays.</li>
            <li className="mb-1">Provide accurate information when additional details are requested.</li>
            <li className="mb-1">Communicate any issues that may affect order fulfilment.</li>
          </ul>
          <p className="mb-4">Timely responses help Treides provide customers with a better shopping experience.</p>

          <h3 className="text-lg font-bold mt-6 mb-2">4. PRODUCT PACKAGING</h3>
          <p className="mb-2">The seller is responsible for properly packaging products before handing them over for delivery.</p>
          <p className="mb-2">You agree to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-1">Ensure products are clean and in good condition.</li>
            <li className="mb-1">Package products securely to prevent damage during transportation.</li>
            <li className="mb-1">Have orders properly prepared before the scheduled collection.</li>
            <li className="mb-1">Include all accessories or components advertised with the product.</li>
          </ul>
          <p className="mb-4">Treides is responsible for coordinating product collection, transportation and delivery to customers. Sellers remain responsible for damage resulting from inadequate packaging before handover.</p>

          <h3 className="text-lg font-bold mt-6 mb-2">5. RETURNS AND CUSTOMER SATISFACTION</h3>
          <p className="mb-2">Treides operates a 24-hour customer return policy.</p>
          <p className="mb-2">By joining Treides, you agree to accept eligible product returns within <strong>24 hours after the customer receives the product</strong> if the customer is not satisfied.</p>
          <p className="mb-2">This includes situations where:</p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-1">The product received is different from what was ordered.</li>
            <li className="mb-1">The product does not match its advertised description or images.</li>
            <li className="mb-1">The product has defects or damage attributable to the seller.</li>
            <li className="mb-1">The customer is dissatisfied and requests a return within the agreed period.</li>
          </ul>
          <p className="mb-4">Returned products should be in their original condition, except where damage or defects are the reason for the return. Treides will coordinate the return process and communicate with both the customer and seller. Return costs and responsibility will depend on the reason for the return and Treides' applicable return policies.</p>

          <h3 className="text-lg font-bold mt-6 mb-2">6. PAYMENTS AND SELLER SETTLEMENTS</h3>
          <p className="mb-2">Treides is responsible for collecting and handling payments made by customers through the platform. To protect sellers against fake customers and fraudulent orders, customers must pay before their products are dispatched.</p>
          <p className="mb-2">Sellers agree that:</p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-1">Customer payments are handled through Treides.</li>
            <li className="mb-1">Sellers should not independently collect payment for orders processed through Treides without authorization.</li>
            <li className="mb-1">Seller payments are released after the customer confirms satisfaction with the product.</li>
            <li className="mb-1">If the customer does not raise a complaint or return request within the 24-hour return period, the order may be considered accepted and eligible for seller payment.</li>
            <li className="mb-1">Any applicable Treides commissions or agreed fees will be deducted before settlement.</li>
          </ul>
          <p className="mb-4">Treides will coordinate the payment and settlement process.</p>

          <h3 className="text-lg font-bold mt-6 mb-2">7. DELIVERY RESPONSIBILITIES</h3>
          <p className="mb-2">Treides is responsible for managing the delivery process, including:</p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-1">Coordinating product collection from sellers.</li>
            <li className="mb-1">Arranging transportation and delivery.</li>
            <li className="mb-1">Managing customer delivery information.</li>
            <li className="mb-1">Providing relevant delivery updates.</li>
            <li className="mb-1">Handling customer payments.</li>
          </ul>
          <p className="mb-4">The seller is responsible for ensuring that products are properly packaged and ready for collection.</p>

          <h3 className="text-lg font-bold mt-6 mb-2">8. BUSINESS LOCATION INFORMATION</h3>
          <p className="mb-2">Sellers are required to provide accurate store or business location information when registering on Treides.</p>
          <p className="mb-2">This information helps Treides:</p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-1">Connect customers with sellers closest to them.</li>
            <li className="mb-1">Improve geographical product discovery.</li>
            <li className="mb-1">Identify convenient sellers for customer orders.</li>
            <li className="mb-1">Provide faster and more efficient delivery options.</li>
            <li className="mb-1">Improve order fulfilment and logistics.</li>
          </ul>
          <p className="mb-4">Sellers agree to keep their business location information accurate and notify Treides of any changes.</p>

          <h3 className="text-lg font-bold mt-6 mb-2">9. MARKETPLACE CONDUCT</h3>
          <p className="mb-2">Sellers agree to operate honestly and professionally on Treides.</p>
          <p className="mb-2">You must not:</p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-1">Upload misleading product images or descriptions.</li>
            <li className="mb-1">Advertise products you cannot supply.</li>
            <li className="mb-1">Deliberately misrepresent product quality or authenticity.</li>
            <li className="mb-1">Repeatedly accept orders that you cannot fulfil.</li>
            <li className="mb-1">Engage in fraudulent activities.</li>
            <li className="mb-1">Attempt to bypass Treides' payment or order processes for transactions originating through the platform.</li>
          </ul>
          <p className="mb-4">Treides reserves the right to investigate complaints and take appropriate action against sellers who violate marketplace policies or compromise customer trust.</p>

          <h3 className="text-lg font-bold mt-6 mb-2">10. TREIDES' RESPONSIBILITIES</h3>
          <p className="mb-2">Treides agrees to provide sellers with a platform and supporting services to facilitate online sales.</p>
          <p className="mb-2">Treides is responsible for:</p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-1">Providing the online marketplace.</li>
            <li className="mb-1">Connecting sellers with potential customers.</li>
            <li className="mb-1">Managing customer payments.</li>
            <li className="mb-1">Coordinating product collection and delivery.</li>
            <li className="mb-1">Protecting sellers against fake customers by requiring payment before dispatch.</li>
            <li className="mb-1">Facilitating customer communication and eligible returns.</li>
            <li className="mb-1">Supporting a trustworthy and reliable marketplace environment.</li>
          </ul>

          <h3 className="text-lg font-bold mt-6 mb-2">11. SUSPENSION AND TERMINATION</h3>
          <p className="mb-4">Treides reserves the right to suspend or terminate a seller's access to the marketplace if the seller repeatedly violates this agreement, engages in fraudulent activity or consistently fails to fulfil customer orders. Outstanding orders, returns, refunds and payments must still be resolved in accordance with the applicable marketplace policies.</p>

          <h3 className="text-lg font-bold mt-6 mb-2">12. ACCEPTANCE OF THIS AGREEMENT</h3>
          <p className="mb-2">By clicking Agree and continuing with seller registration, you confirm that:</p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-1">You have read and understood this Seller Partnership Agreement.</li>
            <li className="mb-1">You agree to comply with the responsibilities outlined in this document.</li>
            <li className="mb-1">You accept the 24-hour customer return policy.</li>
            <li className="mb-1">You understand that Treides manages customer payments and delivery.</li>
            <li className="mb-1">You agree that seller payments are released after customer satisfaction or expiry of the applicable return period without a reported issue.</li>
            <li className="mb-1">You agree to provide accurate product, stock and business location information.</li>
          </ul>
          <p className="mb-4">This agreement forms the basis of your partnership with Treides.</p>
          <p className="mt-6 font-semibold">Thank you for choosing to sell on Treides.</p>
          <p className="mt-2 italic">Together, we are making online shopping in Zimbabwe less intimidating.</p>
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