import { Rocket, DollarSign, GraduationCap } from 'lucide-react';

export default function WhyHireStudents() { 
   return ( 
     <section className="relative z-30 bg-[#0f172a] text-white py-8 px-6 md:px-10 lg:px-16 rounded-xl overflow-hidden isolate"> 
       <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-6"> 
         
         {/* Left Illustration with Optional Glow */} 
         <div className="relative flex-1 flex justify-center md:justify-start"> 
           {/* Background Glow Shape */} 
           <div className="absolute w-[320px] h-[200px] bg-green-500/20 blur-3xl rounded-full -top-4 -left-3"></div> 
           
           {/* Illustration */} 
           <img 
             src="/images/StudentsCollab.png" 
             alt="Students collaborating" 
             className="relative z-10 w-[300px] max-w-full drop-shadow-xl" 
           /> 
         </div> 
 
         {/* Right Content */} 
         <div className="flex-1"> 
           <h2 className="text-2xl md:text-3xl font-bold mb-4"> 
             Why Hire Students? 
           </h2> 
 
           <ul className="space-y-4 text-base"> 
             <li className="flex items-start gap-3"> 
               <Rocket className="text-primary w-5 h-5 mt-1 flex-shrink-0" /> 
               <div> 
                 <h3 className="font-semibold text-sm">Fresh Ideas</h3> 
                 <p className="text-gray-300 text-sm"> 
                   Students bring creativity and innovation. 
                 </p> 
               </div> 
             </li> 
 
             <li className="flex items-start gap-3"> 
               <DollarSign className="text-primary w-5 h-5 mt-1 flex-shrink-0" /> 
               <div> 
                 <h3 className="font-semibold text-sm">Affordable Talent</h3> 
                 <p className="text-gray-300 text-sm"> 
                   High-quality work at student-friendly rates. 
                 </p> 
               </div> 
             </li> 
 
             <li className="flex items-start gap-3"> 
               <GraduationCap className="text-primary w-5 h-5 mt-1 flex-shrink-0" /> 
               <div> 
                 <h3 className="font-semibold text-sm">Support Future Leaders</h3> 
                 <p className="text-gray-300 text-sm"> 
                   Every project helps students grow. 
                 </p> 
               </div> 
             </li> 
           </ul> 
 
           {/* CTA Button */} 
           <button className="mt-5 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition duration-200 text-sm"> 
             Hire Talented Students 
           </button> 
         </div> 
       </div> 
     </section> 
   ); 
 }