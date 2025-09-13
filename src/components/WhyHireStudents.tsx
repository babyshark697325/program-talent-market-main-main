import React from 'react';
import { Rocket, DollarSign, GraduationCap } from 'lucide-react';

const WhyHireStudents: React.FC = () => {
  return (
    <section className="bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white py-16 px-4 relative overflow-hidden border border-black/10 dark:border-white/5 shadow-md transition-shadow rounded-3xl">
      {/* Background glow effect - only on the left */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/20 dark:bg-green-500/8 rounded-full blur-3xl"></div>
      
      <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-8">
         {/* Left Illustration */} 
         <div className="flex-1 flex justify-center items-center">
           <img 
             src="/images/StudentsCollab.png" 
             alt="Students collaborating" 
             className="w-[400px] md:w-[450px] h-auto object-contain mx-auto"
           />
         </div> 
         
         {/* Right Content */}
         <div className="flex-1 max-w-lg">
           <h2 className="text-2xl md:text-3xl font-bold mb-4">
             Why Hire Students?
           </h2>

           <ul className="space-y-4 text-base">
             <li className="flex items-start gap-3">
               <Rocket className="text-primary w-5 h-5 mt-1 flex-shrink-0" />
               <div>
                 <h3 className="font-semibold text-sm">Fresh Ideas</h3>
                 <p className="text-slate-600 dark:text-gray-300 text-sm">
                   Students bring creativity and innovation.
                 </p>
               </div>
             </li>

             <li className="flex items-start gap-3">
               <DollarSign className="text-primary w-5 h-5 mt-1 flex-shrink-0" />
               <div>
                 <h3 className="font-semibold text-sm">Affordable Talent</h3>
                 <p className="text-slate-600 dark:text-gray-300 text-sm">
                   High-quality work at student-friendly rates.
                 </p>
               </div>
             </li>

             <li className="flex items-start gap-3">
               <GraduationCap className="text-primary w-5 h-5 mt-1 flex-shrink-0" />
               <div>
                 <h3 className="font-semibold text-sm">Support Future Leaders</h3>
                 <p className="text-slate-600 dark:text-gray-300 text-sm">
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
};

export default WhyHireStudents;