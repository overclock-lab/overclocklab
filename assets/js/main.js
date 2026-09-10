
const BRAND = {
  name: "Overclock Labs",
  tagline: "Build. Automate. Outpace.",
  Location: "Munirka, New Delhi",
  Whatsapp: "91 9241597137",
  Email: "mail.getlivem@gmail.com"
  };

const navItems = [
  ["index.html","Home","home"],
  ["services.html","Services","services"],
  ["portfolio.html","Portfolio","portfolio"],
  ["pricing.html","Pricing","pricing"],
  ["about.html","About","about"],
  ["faq.html","FAQ","faq"]
];

function header(){
  const page=document.body.dataset.page||"";
  return `
  <header class="site-header">
    <div class="container nav">
      <a class="logo" href="index.html" aria-label="${BRAND.name}">
        <span class="logo-mark">O</span><span>${BRAND.name}</span>
      </a>
      <button class="menu-btn" id="menuBtn" aria-label="Open menu">☰</button>
      <nav class="nav-links" id="navLinks">
        ${navItems.map(n=>`<a href="${n[0]}" class="${page===n[2]?'active':''}">${n[1]}</a>`).join("")}
        <a href="enquiry.html" class="nav-cta">Get Started</a>
      </nav>
    </div>
  </header>`;
}

function footer(){
  return `
  <footer class="footer">
    <div class="container footer-grid">
      <div>
        <a class="logo" href="index.html"><span class="logo-mark">O</span><span>${BRAND.name}</span></a>
        <p class="footer-desc">${BRAND.tagline} <br>Professional websites, automation, enquiry systems, payment solutions and digital content for businesses and professionals.</p>
      </div>
      <div>
        <h4>Services</h4>
        <a href="website-design.html">Website Design & Hosting</a>
        <a href="automation.html">n8n Automation</a>
        <a href="query-processing.html">Query & Lead Automation</a>
        <a href="payment-links.html">Payment Links</a>
        <a href="video-editing.html">Video Editing</a>
      </div>
      <div>
        <h4>Company</h4>
        <a href="portfolio.html">Portfolio</a>
        <a href="pricing.html">Pricing</a>
        <a href="about.html">About</a>
        <a href="team.html">Team</a>
        <a href="faq.html">FAQ</a>
      </div>
      <div>
        <h4>Contact</h4>
        <a href="enquiry.html">Start an Enquiry</a>
        <a href="mailto:${BRAND.Email}">${BRAND.Email}</a>
        <a href="https://wa.me/${BRAND.whatsapp}" target="_blank" rel="noopener">WhatsApp: 8789105772</a>
        <p>${BRAND.Location}, India</p>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container">
        <span>© ${new Date().getFullYear()} ${BRAND.name}. All Rights Reserved.</span>
        <span><a href="privacy.html">Privacy</a> · <a href="terms.html">Terms</a></span>
      </div>
    </div>
  </footer>`;
}

function floating(){
  return `
  <div class="float-actions">
    <a class="float-btn meeting-label" href="enquiry.html?type=consultation">▣ <span>Request a Consultation</span></a>
    <a class="float-btn whatsapp" href="https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent("Hello Overclock Labs, I would like to discuss a project.")}" target="_blank" rel="noopener" aria-label="WhatsApp">◔</a>
  </div>`;
}

function mount(){
  const h=document.getElementById("site-header"), f=document.getElementById("site-footer"), fl=document.getElementById("floating");
  if(h) h.innerHTML=header();
  if(f) f.innerHTML=footer();
  if(fl) fl.innerHTML=floating();

  const btn=document.getElementById("menuBtn"), links=document.getElementById("navLinks");
  if(btn) btn.addEventListener("click",()=>links.classList.toggle("open"));
  document.querySelectorAll(".nav-links a").forEach(a=>a.addEventListener("click",()=>links.classList.remove("open")));

  document.querySelectorAll("[data-count]").forEach(el=>{
    const target=Number(el.dataset.count);
    let start=0; const duration=900, t0=performance.now();
    function tick(t){
      const p=Math.min((t-t0)/duration,1);
      const val=Math.floor(target*(1-Math.pow(1-p,3)));
      el.textContent=val.toLocaleString()+"+";
      if(p<1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });

  const observer=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")});
  },{threshold:.12});
  document.querySelectorAll(".reveal").forEach(e=>observer.observe(e));

  document.querySelectorAll(".filter-btn").forEach(btn=>{
    btn.addEventListener("click",()=>{
      document.querySelectorAll(".filter-btn").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      const filter=btn.dataset.filter;
      document.querySelectorAll("[data-category]").forEach(card=>{
        card.classList.toggle("hidden",filter!=="all" && card.dataset.category!==filter);
      });
    });
  });

  const params=new URLSearchParams(location.search);
  if(params.get("type")){
    const select=document.querySelector("#service");
    if(select) select.value="Consultation / Project Discussion";
  }
}

const LIVE = "https://cloud.activepieces.com/api/v1/webhooks/hGL9t9pV0LwdFXMvNyarQ";

const form = document.getElementById("enquiryForm");

if (form) {
  form.addEventListener("submit", async e => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form).entries());

    const payload = {
      date: new Date().toLocaleString("en-IN"),
      name: data.name || "",
      phone: data.phone || "",
      service: data.service || "",
      budget: data.budget || "",
      message: data.message || ""
    };

    console.log("Sending enquiry to n8n:", payload);

    const status = document.getElementById("formStatus");

    if (status) {
      status.style.display = "block";
      status.textContent = "Submitting your enquiry...";
    }

    try {
      const response = await fetch(LIVE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Webhook returned ${response.status}`);
      }

      console.log("Enquiry successfully sent to n8n.");

      // Keep a local copy as backup
      localStorage.setItem(
        "overclock_last_enquiry",
        JSON.stringify({
          ...payload,
          submittedAt: new Date().toISOString()
        })
      );

      const msg =
`Hello Overclock Labs,

I would like to discuss a project.

Name: ${payload.name}
Phone / WhatsApp: ${payload.phone}
Service: ${payload.service}
Budget: ${payload.budget}
Requirement: ${payload.message}`;

      const wa =
        `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(msg)}`;

      if (status) {
        status.innerHTML =
          `Enquiry submitted successfully. `
      }

      form.reset();

    } catch (error) {

      console.error("Enquiry submission failed:", error);

      if (status) {
        status.innerHTML =
          `Unable to submit the enquiry right now. ` +
          `<a href="https://wa.me/${BRAND.whatsapp}" target="_blank" rel="noopener" ` +
          `style="color:#fff;text-decoration:underline">` +
          `Contact us on WhatsApp →</a>`;
      }
    }
  });
}

document.addEventListener("DOMContentLoaded",mount);
