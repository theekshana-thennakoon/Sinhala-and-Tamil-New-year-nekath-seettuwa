require('dotenv').config();
const nodemailer = require('nodemailer');
const schedule = require('node-schedule');

// 1. Generate Email List (itt2021001-125, ent2021001-125, bst2021001-125)
const generateEmails = () => {
  const emails = [];
  const prefixes = ['itt', 'ent', 'bst'];
  for (const prefix of prefixes) {
    for (let i = 1; i <= 125; i++) {
        const numStr = i.toString().padStart(3, '0');
        emails.push(`${prefix}2021${numStr}@tec.rjt.ac.lk`);
    }
  }
  return emails;
};

const allEmails = generateEmails();

// 2. Setup Nodemailer Transporter with Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // Use your App Password here, NOT the real normal password
  }
});

// Helper: Chunk array (Gmail SMTP has limits on too many recipients in a single message)
function chunkArray(arr, size) {
  return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );
}

// 3. Nekath Data (Matching your HTML)
const nekath = [
      {
        id: 1, icon: "🛁",
        title: "පරණ අවුරුද්ද සඳහා ස්නානය",
        badge: "සඳුදා, අප්‍රේල් 13",
        time: new Date("2026-04-13T06:00:00"),
        desc: "පරණ අවුරුද්ද සමුගැනීමේ ශුභ නැකැතේ ස්නානය සිදු කළ යුතු වේ. මෙය පැරණි වසරෙන් සමු ගෙන නව වසරට ශුද්ධ සිතින් ප්‍රවේශ වීමේ නැකතයි."
      },
      {
        id: 2, icon: "🙏",
        title: "පුණ්‍ය කාලය",
        badge: "අඟහරුවාදා, අප්‍රේල් 14 | පූර්ව භාග. 03:08 – අපර භාග. 03:56",
        time: new Date("2026-04-14T03:08:00"),
        desc: "අප්‍රේල් මස 14 වන අඟහරුවාදා පූර්ව භාග 03.08 සිට එදිනම අපර භාග 03.56 දක්වා පුණ්‍ය කාලය සේදී තිබෙනවා. මෙම ශුභ කාල සීමාව තුළ ආගමික කටයුතු සිදු කිරීම ශ්‍රේෂ්ඨ වේ."
      },
      {
        id: 3, icon: "🌅",
        title: "අලුත් අවුරුදු උදාව",
        badge: "අඟහරුවාදා, අප්‍රේල් 14 | පූර්ව භාග. 09:32",
        time: new Date("2026-04-14T09:32:00"),
        desc: "අප්‍රේල් මස 14 වන අඟහරුවාදා පූර්ව භාග 09.32 ට සිංහල හා දෙමළ අලුත් අවුරුද්ද උදා වේ. මෙය 2026 වසරේ අලුත් අවුරුද්ද ආරම්භය වන ශුභ මොහොතයි."
      },
      {
        id: 4, icon: "🍲",
        title: "ආහාර පිසීම",
        badge: "අඟහරුවාදා, අප්‍රේල් 14 | පූර්ව භාග. 10:51",
        time: new Date("2026-04-14T10:51:00"),
        desc: "අප්‍රේල් මස 14 වන අඟහරුවාදා පූර්වභාග 10.51 ට රක්ත වර්ණ වස්ත්‍රාභරණයෙන් සැරසී දකුණු දිශාව බලා ලිප් බැඳ ගිනි මොළවා කිරිබතක් ද කැවිලි වර්ගයක් ද දී කිරි සහ විළඳ ද පිළියෙල කර ගැනීම මැනවි."
      },
      {
        id: 5, icon: "🤝",
        title: "වැඩ ඇල්ලීම, ගනුදෙනු කිරීම හා ආහාර අනුභවය",
        badge: "අඟහරුවාදා, අප්‍රේල් 14 | අපර භාග. 12:06",
        time: new Date("2026-04-14T12:06:00"),
        desc: "අප්‍රේල් මස 14 වන අඟහරුවාදා අපරභාග 12.06 ට රක්ත වර්ණ වස්ත්‍රාභරණයෙන් සැරසී දකුණු දිශාව බලා සියලු වැඩ අල්ලා ගනුදෙනු කොට ආහාර අනුභව කිරීම මැනවි."
      },
      {
        id: 6, icon: "🌿",
        title: "හිසතෙල් ගෑම",
        badge: "බදාදා, අප්‍රේල් 15 | පූර්ව භාග. 06:55",
        time: new Date("2026-04-15T06:55:00"),
        desc: "අප්‍රේල් මස 15 වන බදාදා පූර්වභාග 6.55 ට පච්ච වර්ණ හෙවත් කොළ පැහැති වස්ත්‍රාභරණයෙන් සැරසී නැගෙනහිර දිශාව බලා හිසට කොහොඹපත් ද පයට කොළොන් පත් ද තබා කොහොඹපත් යුෂ මිශ්‍ර නානු හා තෙල් ගා ස්නානය කිරීම මැනවි."
      },
      {
        id: 7, icon: "👜",
        title: "රැකී රක්ෂා සඳහා පිටත්ව යාම",
        badge: "සඳුදා, අප්‍රේල් 20 | පූර්ව භාග. 06:27",
        time: new Date("2026-04-20T06:27:00"),
        desc: "අප්‍රේල් මස 20 වන සඳුදා පූර්වභාග 06.27 ට ස්වේත වර්ණ වස්ත්‍රාභරණයෙන් සැරසී කිරි බතක් ද එලකිරි මිශ්‍ර කැවිලි වර්ගයක් ද අනුභව කර දකුණු දිශාව බලා හෝ. අප්‍රේල් මස 20 වන සඳුදා පූර්වභාග 06.50 ට මුතු හා ස්වේත වර්ණ වස්ත්‍රාභරණයෙන් සැරසී ගිතෙල් හා තල මිහ්‍ර කිරිබතක් ද දී කිරි සහ අග්ගලා සමග කැවිලි වර්ගයක් ද අනුභව කර නැගෙනහිර දිශාව බලා පිටත්ව යෑම මැනවි."
      },
      {
        id: 8, icon: "🌱",
        title: "පැළ සිටුවීම",
        badge: "බ්‍රහස්පතින්දා, අප්‍රේල් 23 | පූර්ව භාග. 09:01",
        time: new Date("2026-04-23T09:01:00"),
        desc: "අප්‍රේල් මස 23 වන බ්‍රහස්පතින්දා පූර්වභාග 09.01 ට රන්වන් පැහැති වස්ත්‍රාභරණයෙන් සැරසී උතුරු දිශාව බලා පැළ සිටුවීම මැනවි."
      }
];

// 4. Send Email Function
const sendNekathEmail = async (k) => {
  console.log(`[${new Date().toLocaleTimeString()}] Sending emails for: ${k.title}`);
  
  // Create beautiful HTML email matching site theme
  const htmlBody = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; background-color: #3e3b00; border-radius: 12px; text-align: center; color: #ffd700; max-width: 500px; margin: 0 auto; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
      <div style="font-size: 50px; margin-bottom: 10px;">${k.icon}</div>
      <h1 style="color: #ffd700; font-size: 26px; margin: 0 0 10px 0;">${k.title}</h1>
      <h3 style="color: #e0be00; font-size: 14px; background: rgba(255,215,0,0.1); display: inline-block; padding: 6px 12px; border-radius: 20px; font-weight: normal; margin-top: 0;">${k.badge}</h3>
      <p style="font-size: 15px; line-height: 1.6; color: #fff; margin-top: 25px; padding: 0 10px;">
        ${k.desc}
      </p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,215,0,0.2); font-size: 13px; color: #a49900;">
        සුභ අලුත් අවුරුද්දක් වේවා! 🎊<br>
        <strong>තිසුල ඩිවලොප්මන්ට්</strong>
      </div>
    </div>
  `;

  // Process sending in batches of 90 to respect Gmail limits and not timeout
  const chunks = chunkArray(allEmails, 90);
  for (let i = 0; i < chunks.length; i++) {
    try {
      await transporter.sendMail({
        from: `"Thisula Development" <${process.env.EMAIL_USER}>`,
        bcc: chunks[i].join(','),
        subject: `නැකැත් මතක් කිරීම: ${k.title} 🌟`,
        html: htmlBody
      });
      console.log(` => Sent chunk ${i + 1}/${chunks.length} targeting ${chunks[i].length} recipients.`);
      
      // Delay slightly between chunks to prevent aggressive rate limiting
      if(i < chunks.length - 1) {
          await new Promise(r => setTimeout(r, 2000));
      }
    } catch (err) {
      console.error(` => Failed to send chunk ${i + 1} for ${k.title}:`, err);
    }
  }
  console.log(`[${new Date().toLocaleTimeString()}] Finished sending ${k.title}`);
};

// 5. Setup node-schedule
const scheduleNekathEmails = () => {
  const now = new Date();
  console.log(`Starting scheduling system. Found ${allEmails.length} recipients.`);
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("ERROR: EMAIL_USER and EMAIL_PASS are not set in .env file.");
      process.exit(1);
  }

  let futureCount = 0;
  nekath.forEach(k => {
    if (k.time > now) {
      console.log(`[Scheduled] ${k.title} at ${k.time.toISOString()}`);
      schedule.scheduleJob(k.time, () => {
        sendNekathEmail(k);
      });
      futureCount++;
    } else {
      console.log(`[Skipped] ${k.title} (Time has already passed)`);
    }
  });
  
  if (futureCount === 0) {
      console.log("No future nekath times found to schedule.");
  } else {
      console.log('--- System is active and waiting ---');
  }
};

scheduleNekathEmails();

/* 
  UNCOMMENT BELOW TO TEST INSTANTLY: 
  This sends the format of the 3rd nekath to check if your SMTP and HTML works.
  It's currently set to just send to your EMAIL_USER so it doesn't spam students!
*/

// setTimeout(() => {
//     console.log("--- RUNNING DEV TEST EMAIL ---");
//     const k = nekath[2]; // 3rd item
//     transporter.sendMail({
//         from: `"Thisula Development" <${process.env.EMAIL_USER}>`,
//         to: process.env.EMAIL_USER,
//         subject: `[TEST] නැකැත් මතක් කිරීම: ${k.title} 🌟`,
//         html: `<h1>THIS IS A TEST FORMAT PREVIEW</h1><p>Not sending to students.</p>`,
//     }).then(() => console.log('Test Sent OK')).catch(e => console.error(e));
// }, 2000);
