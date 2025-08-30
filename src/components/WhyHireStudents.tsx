import { Rocket, DollarSign, GraduationCap } from 'lucide-react';

export default function WhyHireStudents() { 
   return ( 
     <section className="bg-[#0f172a] text-white py-16 px-6 md:px-12 lg:px-24 rounded-xl"> 
       <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-12"> 
         
         {/* Left Illustration with Optional Glow */} 
         <div className="relative flex-1 flex justify-center md:justify-start"> 
           {/* Background Glow Shape */} 
           <div className="absolute w-[480px] h-[300px] bg-green-500/20 blur-3xl rounded-full -top-8 -left-6"></div> 
           
           {/* Illustration */} 
           <img 
             src="/images/StudentsCollab.png" 
             alt="Students collaborating" 
             className="relative z-10 w-[440px] max-w-full drop-shadow-xl" 
           /> 
         </div> 
 
         {/* Right Content */} 
         <div className="flex-1"> 
           <h2 className="text-3xl md:text-4xl font-bold mb-6"> 
             Why Hire Students? 
           </h2> 
 
           <ul className="space-y-6 text-lg"> 
             <li className="flex items-start gap-4"> 
               <Rocket className="text-primary w-6 h-6 mt-1 flex-shrink-0" /> 
               <div> 
                 <h3 className="font-semibold">Fresh Ideas</h3> 
                 <p className="text-gray-300"> 
                   Students bring creativity and innovation. 
                 </p> 
               </div> 
             </li> 
 
             <li className="flex items-start gap-4"> 
               <DollarSign className="text-primary w-6 h-6 mt-1 flex-shrink-0" /> 
               <div> 
                 <h3 className="font-semibold">Affordable Talent</h3> 
                 <p className="text-gray-300"> 
                   High-quality work at student-friendly rates. 
                 </p> 
               </div> 
             </li> 
 
             <li className="flex items-start gap-4"> 
               <GraduationCap className="text-primary w-6 h-6 mt-1 flex-shrink-0" /> 
               <div> 
                 <h3 className="font-semibold">Support Future Leaders</h3> 
                 <p className="text-gray-300"> 
                   Every project helps students grow. 
                 </p> 
               </div> 
             </li> 
           </ul> 
 
           {/* CTA Button */} 
           <button className="mt-8 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition duration-200"> 
             Hire Talented Students 
           </button> 
         </div> 
       </div> 
     </section> 
   ); 
 }