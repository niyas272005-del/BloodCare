/* =============================================
   BLOODCARE — SHARED DATA
   ============================================= */

const BC_DONORS = [
  { id:1, name:'Rahul Kumar', initials:'RK', blood:'O+', city:'Mumbai', age:28, donations:15, lastDonation:'2025-12-10', available:true, phone:'+91 98765 43210', badges:['Life Saver','Champion','First Responder'] },
  { id:2, name:'Priya Anand', initials:'PA', blood:'A-', city:'Delhi', age:25, donations:8, lastDonation:'2026-01-15', available:true, phone:'+91 91234 56789', badges:['Life Saver','Star Donor'] },
  { id:3, name:'Arjun Sharma', initials:'AS', blood:'B+', city:'Bangalore', age:32, donations:22, lastDonation:'2025-11-20', available:false, phone:'+91 87654 32109', badges:['Champion','Life Saver','Star Donor'] },
  { id:4, name:'Meera Nair', initials:'MN', blood:'AB+', city:'Chennai', age:29, donations:5, lastDonation:'2026-02-01', available:true, phone:'+91 76543 21098', badges:['Life Saver'] },
  { id:5, name:'Vikram Singh', initials:'VS', blood:'O-', city:'Hyderabad', age:35, donations:30, lastDonation:'2025-10-05', available:true, phone:'+91 65432 10987', badges:['Champion','Life Saver','First Responder','Star Donor'] },
  { id:6, name:'Anjali Mehta', initials:'AM', blood:'B-', city:'Pune', age:27, donations:12, lastDonation:'2025-12-28', available:true, phone:'+91 54321 09876', badges:['Life Saver','Star Donor'] },
  { id:7, name:'Deepak Patel', initials:'DP', blood:'A+', city:'Ahmedabad', age:31, donations:18, lastDonation:'2025-11-12', available:false, phone:'+91 43210 98765', badges:['Champion','Life Saver'] },
  { id:8, name:'Sneha Reddy', initials:'SR', blood:'AB-', city:'Kolkata', age:26, donations:7, lastDonation:'2026-01-22', available:true, phone:'+91 32109 87654', badges:['Life Saver'] },
  { id:9, name:'Karan Malhotra', initials:'KM', blood:'O+', city:'Mumbai', age:30, donations:20, lastDonation:'2025-12-01', available:true, phone:'+91 21098 76543', badges:['Champion','Life Saver','Star Donor'] },
  { id:10, name:'Divya Iyer', initials:'DI', blood:'A+', city:'Delhi', age:24, donations:3, lastDonation:'2026-02-10', available:true, phone:'+91 10987 65432', badges:['Life Saver'] },
  { id:11, name:'Rohan Das', initials:'RD', blood:'B+', city:'Bangalore', age:33, donations:25, lastDonation:'2025-10-18', available:true, phone:'+91 99887 76654', badges:['Champion','Life Saver','First Responder'] },
  { id:12, name:'Pooja Gupta', initials:'PG', blood:'O-', city:'Jaipur', age:28, donations:11, lastDonation:'2025-12-15', available:false, phone:'+91 88776 65543', badges:['Life Saver','Star Donor'] },
];

const BC_HOSPITALS = [
  { id:1, name:'AIIMS Delhi', icon:'🏥', distance:'2.3 km', emergency:true, contact:'+91 11 2658 8500', address:'Ansari Nagar, New Delhi', blood:{ 'A+':'High','B+':'Medium','O+':'High','AB+':'Low','O-':'Critical' } },
  { id:2, name:'Apollo Hospital', icon:'🏨', distance:'3.8 km', emergency:true, contact:'+91 44 2829 3333', address:'Greams Road, Chennai', blood:{ 'A+':'High','A-':'Medium','B+':'High','O+':'Medium','AB-':'Low' } },
  { id:3, name:'Fortis Healthcare', icon:'🏥', distance:'5.1 km', emergency:false, contact:'+91 124 4921 021', address:'Sector 44, Gurgaon', blood:{ 'B+':'High','B-':'Low','AB+':'Medium','O-':'High' } },
  { id:4, name:'Lilavati Hospital', icon:'🏨', distance:'1.9 km', emergency:true, contact:'+91 22 2675 1000', address:'Bandra West, Mumbai', blood:{ 'A+':'Medium','O+':'High','B+':'Medium','AB+':'High' } },
  { id:5, name:'Manipal Hospital', icon:'🏥', distance:'4.5 km', emergency:false, contact:'+91 80 2502 4444', address:'HAL Airport Road, Bangalore', blood:{ 'O+':'High','A+':'High','B+':'Low','AB-':'Medium' } },
  { id:6, name:'Max Super Speciality', icon:'🏨', distance:'6.2 km', emergency:true, contact:'+91 11 2651 5050', address:'Saket, New Delhi', blood:{ 'A+':'Low','O+':'Medium','B+':'High','O-':'High' } },
];

const BC_EMERGENCIES = [
  { id:1, blood:'O-', hospital:'AIIMS Delhi', city:'New Delhi', urgency:'critical', postedAt:'5 min ago', units:2, contact:'+91 11 2658 8500', notes:'Post-surgery patient in ICU' },
  { id:2, blood:'B+', hospital:'Apollo Hospital', city:'Chennai', urgency:'high', postedAt:'18 min ago', units:3, contact:'+91 44 2829 3333', notes:'Accident victim, urgent transfusion needed' },
  { id:3, blood:'AB-', hospital:'Lilavati Hospital', city:'Mumbai', urgency:'high', postedAt:'32 min ago', units:1, contact:'+91 22 2675 1000', notes:'Rare blood group, please respond immediately' },
  { id:4, blood:'A+', hospital:'Fortis Healthcare', city:'Gurgaon', urgency:'medium', postedAt:'1 hr ago', units:2, contact:'+91 124 4921 021', notes:'Scheduled surgery tomorrow morning' },
  { id:5, blood:'O+', hospital:'Max Speciality', city:'New Delhi', urgency:'critical', postedAt:'8 min ago', units:4, contact:'+91 11 2651 5050', notes:'Multiple trauma patients from road accident' },
  { id:6, blood:'B-', hospital:'Manipal Hospital', city:'Bangalore', urgency:'medium', postedAt:'2 hr ago', units:1, contact:'+91 80 2502 4444', notes:'Dengue patient with low platelet count' },
];

const BC_STORIES = [
  { id:1, author:'Rahul Kumar', initials:'RK', city:'Mumbai', donations:15, text:'"I\'ve been donating blood for 5 years. The feeling of knowing I\'ve saved lives is indescribable. Join BloodCare today!"', likes:142, comments:28, badge:'Hero' },
  { id:2, author:'Priya Anand', initials:'PA', city:'Delhi', donations:8, text:'"My father needed AB- blood urgently. BloodCare connected us to a donor in under 10 minutes. This platform saved his life."', likes:98, comments:14, badge:'Active' },
  { id:3, author:'Arjun Sharma', initials:'AS', city:'Bangalore', donations:22, text:'"Being a regular donor is the most fulfilling thing I do. BloodCare makes it effortless to track my impact and stay connected."', likes:201, comments:45, badge:'Champion' },
  { id:4, author:'Meera Nair', initials:'MN', city:'Chennai', donations:5, text:'"First-time donor here! BloodCare guided me through the entire process. It was simple, quick, and the most meaningful thing I did this year."', likes:67, comments:19, badge:'New' },
];

const BC_CAMPAIGNS = [
  { id:1, title:'World Blood Donor Day 2025', description:'Join our city-wide campaign and help collect 10,000 units of blood.', goal:10000, collected:7840, date:'June 14, 2025', icon:'🌍' },
  { id:2, title:'Emergency Relief Drive', description:'Supporting hospitals affected by the recent crisis in northern states.', goal:5000, collected:4200, date:'Ongoing', icon:'🚨' },
  { id:3, title:'Thalassemia Awareness Month', description:'Special drive for thalassemia patients requiring regular transfusions.', goal:3000, collected:1950, date:'May 2025', icon:'💉' },
];

const BC_ACHIEVEMENTS = [
  { icon:'🥇', title:'Life Saver', desc:'Donated 10+ times', req:10 },
  { icon:'🏆', title:'Champion', desc:'Donated 25+ times', req:25 },
  { icon:'⭐', title:'Star Donor', desc:'5-star community rating', req:null },
  { icon:'🚀', title:'First Responder', desc:'Responded to emergency request', req:null },
  { icon:'👑', title:'Legend', desc:'Donated 50+ times', req:50 },
  { icon:'🎖️', title:'Rare Hero', desc:'Rare blood group donor', req:null },
  { icon:'🌟', title:'Community Builder', desc:'Referred 5+ donors', req:5 },
  { icon:'💎', title:'Diamond Donor', desc:'100+ donations', req:100 },
];

const BC_LEADERBOARD = [
  { rank:1, name:'Vikram Singh', initials:'VS', city:'Hyderabad', blood:'O-', donations:30, badge:'Legend' },
  { rank:2, name:'Arjun Sharma', initials:'AS', city:'Bangalore', blood:'B+', donations:25, badge:'Champion' },
  { rank:3, name:'Deepak Patel', initials:'DP', city:'Ahmedabad', blood:'A+', donations:22, badge:'Champion' },
  { rank:4, name:'Karan Malhotra', initials:'KM', city:'Mumbai', blood:'O+', donations:20, badge:'Life Saver' },
  { rank:5, name:'Rohan Das', initials:'RD', city:'Bangalore', blood:'B+', donations:18, badge:'Life Saver' },
];

const BC_FAQS = [
  { q:'Who can donate blood?', a:'Anyone aged 18-65, weighing at least 50kg, and in good health. You must not have donated blood in the last 3 months.' },
  { q:'How long does donation take?', a:'The entire process takes about 30-45 minutes, with the actual blood drawing taking only 8-10 minutes.' },
  { q:'Is blood donation safe?', a:'Yes! Completely sterile, single-use equipment is used. You cannot get any disease from donating blood.' },
  { q:'How often can I donate?', a:'Whole blood can be donated every 3 months. Platelets can be donated every 2 weeks.' },
  { q:'What should I do before donating?', a:'Eat a healthy meal, drink plenty of water, and get a good night\'s sleep. Avoid fatty foods 4 hours before donating.' },
  { q:'Are there any side effects?', a:'Minor side effects like dizziness or lightheadedness are rare. Most donors feel completely fine after donating.' },
];

const BC_ELIGIBILITY = [
  { icon:'✅', label:'Age 18-65 years', ok:true },
  { icon:'✅', label:'Weight ≥ 50 kg', ok:true },
  { icon:'✅', label:'Hemoglobin ≥ 12.5 g/dL', ok:true },
  { icon:'✅', label:'No fever or infection', ok:true },
  { icon:'❌', label:'Recent surgery (< 6 months)', ok:false },
  { icon:'❌', label:'Pregnancy or recent childbirth', ok:false },
  { icon:'❌', label:'Certain medications', ok:false },
  { icon:'❌', label:'Recent tattoo (< 12 months)', ok:false },
];

const BC_TIPS = [
  { icon:'💧', tip:'Drink at least 2 extra glasses of water before donating.' },
  { icon:'🥗', tip:'Eat iron-rich foods like spinach, lentils, and red meat in the days before donation.' },
  { icon:'😴', tip:'Get a good night\'s sleep before your donation appointment.' },
  { icon:'🚫', tip:'Avoid alcohol for 24 hours before and after donating.' },
  { icon:'🧘', tip:'Stay relaxed. Stress can affect your blood pressure reading.' },
  { icon:'👟', tip:'Wear comfortable, loose-fitting clothes with sleeves that roll up easily.' },
];

const BC_CHAT_RESPONSES = {
  'find donor': 'You can find donors by visiting our <a href="donors.html">Donors page</a>. Filter by blood group, city, and availability!',
  'blood group': 'Common blood groups are A+, A-, B+, B-, AB+, AB-, O+, O-. O- is the universal donor and AB+ is the universal recipient. Check our <a href="education.html">Education Center</a> for the full compatibility chart.',
  'eligibility': 'To donate blood you must be: aged 18-65, weigh at least 50kg, be in good health, and not have donated in the last 3 months.',
  'emergency': 'For emergency blood requests, visit our <a href="emergency.html">Emergency Center</a>. You can also call the nearest hospital directly.',
  'register': 'Ready to be a hero? <a href="register.html">Register as a donor here</a>. It only takes 2 minutes!',
  'hospital': 'Find nearby blood banks and hospitals on our <a href="hospitals.html">Hospitals page</a>.',
  'donate': 'Donating blood takes only 30-45 minutes and can save up to 3 lives! <a href="register.html">Register today</a>.',
  'default': 'I can help you find donors, check blood compatibility, locate hospitals, or learn about donation. What would you like to know?',
};
