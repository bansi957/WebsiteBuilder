const User=require("../model/user_model")
const Website=require("../model/website_model")
const generateResponse=require("../config/openRouter")
const extractjson=require("../utils/extractjson")
let masterPrompt=`
YOU ARE A PRINCIPAL FRONTEND ARCHITECT
AND A SENIOR UI/UX ENGINEER SPECIALIZED IN
RESPONSIVE DESIGN SYSTEMS.

YOU BUILD HIGH-END, REAL-WORLD, PRODUCTION-GRADE
WEBSITES USING ONLY HTML, CSS, AND JAVASCRIPT.

THE OUTPUT MUST BE CLIENT-DELIVERABLE WITHOUT MODIFICATION.

❌ NO FRAMEWORKS
❌ NO LIBRARIES
❌ NO PLACEHOLDERS
❌ NO NON-RESPONSIVE LAYOUTS

--------------------------------------------------
USER REQUIREMENT
--------------------------------------------------
{USER_PROMPT}

--------------------------------------------------
SITE STRUCTURE (IMPORTANT)
--------------------------------------------------

The page structure MUST be determined from the user requirement.

Examples:

If user asks for **portfolio website**:
- Home
- About
- Projects / Portfolio
- Skills
- Contact

If user asks for **startup / SaaS website**:
- Home
- Features
- Pricing
- About
- Contact

If user asks for **business website**:
- Home
- Services
- About
- Testimonials
- Contact

If user asks for **restaurant website**:
- Home
- Menu
- About
- Gallery
- Contact

⚠️ DO NOT FORCE SECTIONS THAT ARE NOT RELEVANT.

Example:
Portfolio websites usually DO NOT need "Services".

--------------------------------------------------
GLOBAL QUALITY BAR
--------------------------------------------------

- Premium modern UI (2026 design standard)
- Professional spacing and typography
- Clean visual hierarchy
- Realistic content (no lorem ipsum)
- Smooth hover animations
- Production-quality layout

--------------------------------------------------
RESPONSIVE DESIGN (MANDATORY)
--------------------------------------------------

Mobile-first design.

Breakpoints:
- Mobile <768px
- Tablet 768–1024px
- Desktop >1024px

Use:
- Flexbox / Grid
- Relative units (%, rem, vw)
- Media queries

Responsive requirements:
- Navbar adapts to mobile
- Multi-column layouts collapse on mobile
- Images scale correctly
- Buttons are touch friendly
- No horizontal scroll on mobile

--------------------------------------------------
IMAGES
--------------------------------------------------

Use only images from:
https://images.unsplash.com/

Every image URL MUST include:

?auto=format&fit=crop&w=1200&q=80

Images must:
- be responsive
- max-width:100%
- never overflow containers

--------------------------------------------------
TECHNICAL RULES
--------------------------------------------------

- Output ONE HTML file
- Exactly ONE <style> tag
- Exactly ONE <script> tag
- No external CSS/JS/fonts
- System fonts only
- iframe srcdoc compatible
- Clean readable code

--------------------------------------------------
INTERACTIVITY
--------------------------------------------------

- Smooth hover effects
- Navigation interactions
- JS form validation
- Smooth scrolling or page switching

--------------------------------------------------
FINAL SELF CHECK
--------------------------------------------------

Before responding verify:

1. Responsive layout works
2. No horizontal scroll
3. Images scale properly
4. Navigation works
5. Layout adapts to screen sizes

If any fails → regenerate internally.

--------------------------------------------------
OUTPUT FORMAT (STRICT)
--------------------------------------------------

Return RAW JSON ONLY

{
  "message": "Short professional confirmation sentence",
  "code": "<FULL HTML DOCUMENT>"
}

--------------------------------------------------
ABSOLUTE RULES
--------------------------------------------------

- NO markdown
- NO explanations
- NO extra text
- ONLY raw JSON`;

const generateWebsite=async (req,res)=>{
    try {
        const {prompt}=req.body
        if(!prompt){
            return res.status(400).json({error:"Prompt is required"})
        }
        let user=await User.findById(req.user._id)
        if(!user){
            return res.status(400).json({error:"User not found"})
        }
        if (user.credits<50){
            return res.status(400).json({error:"Not enough credits"})
        }
        const finalPrompt=masterPrompt.replace("USER_PROMPT",prompt)
        let raw=""
        let parsed=null
        for (let i=0;i<2 && !parsed;i++){
             raw=await generateResponse(finalPrompt)
             parsed=await extractjson(raw)
             if(!parsed){
                raw=await generateResponse(finalPrompt+"\n\nIMPORTANT: THE RESPONSE MUST BE ONLY RAW JSON. NO MARKDOWN, NO EXPLANATIONS, NO EXTRA TEXT. IF YOU ARE NOT RETURNING RAW JSON, PLEASE FIX IT AND RETURN AGAIN.")
                parsed=await extractjson(raw)
             }
        }

        if(!parsed.code){
            return res.status(400).json({error:"Failed to generate valid HTML"})
        }
        const website=await Website.create({
            user: user._id,
            title: prompt.slice(0,50),
            latestCode: parsed.code,
            conversation: [{role:"ai",content:parsed.message}, {role:"user",content:prompt}],
            slug: prompt.slice(0,50).toLowerCase().replace(/[^a-z0-9]+/g, '-')
        })
        user.credits-=50
        await user.save()
        return res.json({message:"Website generated successfully", websiteId: website._id,remainingCredits: user.credits})
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:"Internal server error"})
    }
}

const getWebsiteById=async (req,res)=>{
  try {
    const {websiteId}=req.params
    const website=await Website.findOne({ _id: websiteId ,user: req.user._id})
    if(!website){
        return res.status(404).json({error:"Website not found"})
    } 
   
    return res.status(200).json({website})
  } catch (error) {
    return res.status(500).json({message:"get website by id failed"})
  }
}

const changes=async(req,res)=>{
  try {
       const {prompt}=req.body
        if(!prompt){
            return res.status(400).json({error:"Prompt is required"})
        }
        let user=await User.findById(req.user._id)
        if(!user){
            return res.status(400).json({error:"User not found"})
        }
        if (user.credits<25){
            return res.status(400).json({error:"Not enough credits"})
        }
        
        const {websiteId}=req.params
        let website=await Website.findOne({ _id: websiteId ,user: req.user._id})
        if(!website){
            return res.status(404).json({error:"Website not found"})
        }
        
        const updatePrompt=`UPDATE THIS HTML WEBSITE.
        
        CURRENT CODE:${website.latestCode}
        USER REQUEST:${prompt}
        RETURN RAW JSON ONLY:{
        "message": "Short professional confirmation sentence",
        "code":<UPDATED  FULL HTML>}
      `
        let raw=""
        let parsed=null
        for (let i=0;i<2 && !parsed;i++){
             raw=await generateResponse(updatePrompt)
             parsed=await extractjson(raw)
             if(!parsed){
                raw=await generateResponse(updatePrompt+"\n\nIMPORTANT: THE RESPONSE MUST BE ONLY RAW JSON. NO MARKDOWN, NO EXPLANATIONS, NO EXTRA TEXT. IF YOU ARE NOT RETURNING RAW JSON, PLEASE FIX IT AND RETURN AGAIN.")
                parsed=await extractjson(raw)
             }
        }

        if(!parsed.code){
            return res.status(400).json({error:"Failed to generate valid HTML"})
        }
        website.conversation.push({role:"user",content: prompt},{role:"ai",content: parsed.message})
        website.latestCode=parsed.code
        await website.save()
        user.credits-=25
        await user.save()
        return res.status(200).json({message:parsed.message,remainingCredits: user.credits,code:parsed.code})


  } catch (error) {
   
    return res.status(500).json({error:"Website update error"})
  }
}

const getAllWebsites=async (req,res)=>{
    try{
      const websites=await Website.find({user:req.user._id})
      return res.status(200).json(websites)
    }
    catch(error){
      return res.status(500).json({error:"set all websites error"})
    }
  }

  
module.exports={generateWebsite,getWebsiteById,changes,getAllWebsites}