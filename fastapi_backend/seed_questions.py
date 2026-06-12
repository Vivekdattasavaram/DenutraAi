import json
from database import SessionLocal
import models

def seed_questions():
    db = SessionLocal()
    db.query(models.AssessmentAnswer).delete()
    db.query(models.Assessment).delete()
    db.query(models.QuestionBank).delete()

    categories = [
        "Brushing Habits",
        "Flossing Habits",
        "Gum Health",
        "Diet & Sugar Consumption",
        "Dental Visits",
        "Oral Hygiene Knowledge"
    ]
    difficulties = ["Basic", "Medium", "Advanced"]
    
    questions = []

    # Brushing Habits
    brushing_basic = [
        ("How often should you brush your teeth?", ["Once a day", "Twice a day", "Every other day", "Only when they look dirty"], 1, "The ADA recommends brushing twice a day for two minutes each time."),
        ("How long should you brush your teeth?", ["30 seconds", "1 minute", "2 minutes", "5 minutes"], 2, "Brushing for two minutes ensures you have enough time to clean all surfaces."),
        ("When is the most important time to brush your teeth?", ["Morning", "After lunch", "Before bed", "Before breakfast"], 2, "Brushing before bed removes plaque and food particles that can cause damage overnight."),
        ("What type of toothbrush bristles are recommended?", ["Hard", "Medium", "Soft", "It doesn't matter"], 2, "Soft bristles are gentlest on your gums and enamel."),
        ("How often should you replace your toothbrush?", ["Every month", "Every 3-4 months", "Every year", "When the bristles fall out"], 1, "Toothbrushes become less effective and harbor bacteria over time.")
    ]
    brushing_medium = [
        ("What is the recommended brushing angle against the gums?", ["90 degrees", "45 degrees", "180 degrees", "Parallel"], 1, "A 45-degree angle allows the bristles to clean slightly under the gumline."),
        ("Which brushing technique is generally recommended by dentists?", ["Scrubbing back and forth", "Modified Bass Technique", "Circular only", "Vertical only"], 1, "The Modified Bass technique uses short strokes at a 45-degree angle."),
        ("Should you rinse with water immediately after brushing with fluoride toothpaste?", ["Yes", "No", "Only if you want to", "Yes, with warm water"], 1, "Spit out the excess toothpaste but do not rinse, so the fluoride has time to protect your teeth."),
        ("What does brushing too hard cause?", ["Whiter teeth", "Enamel abrasion", "Stronger gums", "Better breath"], 1, "Brushing too hard can wear away enamel and cause gum recession."),
        ("Is it better to brush immediately after eating acidic foods?", ["Yes", "No", "Doesn't matter", "Only with cold water"], 1, "Wait at least 30 minutes, as acid softens enamel and brushing can wear it away.")
    ]
    brushing_advanced = [
        ("What is the primary purpose of toothpaste?", ["To whiten teeth", "To freshen breath", "To deliver fluoride and aid in mechanical removal of plaque", "To taste good"], 2, "Toothpaste acts as an abrasive to remove plaque and delivers protective fluoride."),
        ("How does fluoride work to protect teeth?", ["It kills all bacteria", "It coats the teeth in plastic", "It promotes remineralization of enamel", "It makes saliva more acidic"], 2, "Fluoride incorporates into the tooth structure, making it more resistant to acid attacks."),
        ("What is the 'pellicle'?", ["A type of cavity", "A protein film that forms on teeth", "A dental instrument", "A type of bacteria"], 1, "The pellicle is a thin protein film that forms on teeth shortly after brushing."),
        ("What role does saliva play in oral health?", ["It causes cavities", "It buffers acids and aids remineralization", "It stains teeth", "None"], 1, "Saliva helps neutralize acids produced by bacteria and provides minerals to repair enamel."),
        ("What is the main component of dental plaque?", ["Food particles", "Bacteria and their byproducts", "Saliva", "Stains"], 1, "Plaque is a sticky biofilm composed primarily of bacteria.")
    ]

    # Flossing Habits
    flossing_basic = [
        ("How often should you floss your teeth?", ["Once a week", "Once a day", "Only when food is stuck", "Never"], 1, "Flossing daily removes plaque between teeth where a toothbrush can't reach."),
        ("What is the main purpose of flossing?", ["To make breath smell better", "To remove plaque and food between teeth", "To whiten teeth", "To make gums bleed"], 1, "Flossing cleans the tight spaces between your teeth and under the gumline."),
        ("Should you floss before or after brushing?", ["Before", "After", "It doesn't matter", "At the same time"], 0, "Flossing before brushing can help loosen plaque so it can be brushed away."),
        ("Is it normal for gums to bleed slightly when you first start flossing?", ["Yes", "No", "Only if you use thick floss", "Only if you are over 50"], 0, "Initial bleeding is common due to inflammation, but it should stop after regular flossing."),
        ("What shape should you make with the floss around each tooth?", ["A straight line", "A 'C' shape", "A circle", "An 'X' shape"], 1, "Curving the floss in a 'C' shape helps clean the sides of the tooth effectively.")
    ]
    flossing_medium = [
        ("How much of the tooth surface does brushing miss?", ["10%", "35%", "50%", "75%"], 1, "Brushing alone misses about 35% of the tooth surface, which is why flossing is essential."),
        ("Can a water flosser replace string floss?", ["Yes, completely", "No, but it's a good supplement", "Only for children", "Water flossers are useless"], 1, "Water flossers are great, but traditional string floss is better at scraping off sticky plaque."),
        ("What is interdental brushing?", ["Brushing the tongue", "Using small brushes to clean between teeth", "Brushing the roof of the mouth", "Using a motorized toothbrush"], 1, "Interdental brushes are small brushes designed to clean between teeth, similar to flossing."),
        ("Why is plaque dangerous if left between teeth?", ["It turns into tartar and causes cavities/gum disease", "It changes the color of your teeth permanently", "It causes bad breath only", "It shrinks the teeth"], 0, "Plaque that isn't removed hardens into tartar, leading to decay and periodontal disease."),
        ("How deep should floss go beneath the gumline?", ["Not at all", "Just slightly below the gumline", "As deep as possible", "Until it hurts"], 1, "Gently guide the floss slightly below the gumline to clean out hidden plaque without causing injury.")
    ]
    flossing_advanced = [
        ("What type of bacteria primarily colonizes the interproximal spaces?", ["Aerobic", "Anaerobic", "Fungal", "Viral"], 1, "The tight spaces between teeth have low oxygen, favoring disease-causing anaerobic bacteria."),
        ("What is the medical term for the space between two adjacent teeth?", ["Gingival sulcus", "Interproximal space", "Occlusal surface", "Apical foramen"], 1, "The interproximal space is the area between adjacent teeth."),
        ("How does flossing prevent periodontal disease?", ["By disrupting the biofilm and reducing inflammation", "By delivering fluoride", "By killing bacteria directly", "By whitening the roots"], 0, "Physical disruption of the biofilm prevents the immune response that leads to bone loss."),
        ("What is 'gingival stippling'?", ["Bleeding gums", "The orange-peel texture of healthy gums", "A type of mouth ulcer", "Tartar buildup"], 1, "Stippling is a sign of healthy, firm gum tissue."),
        ("Which of these is a sign of advanced periodontal disease?", ["Slight bleeding", "Tooth mobility and bone loss", "Yellow teeth", "Morning breath"], 1, "Advanced periodontal disease involves the destruction of the supporting bone, causing loose teeth.")
    ]

    # Gum Health
    gum_basic = [
        ("What color are healthy gums?", ["Bright red", "Pale pink", "White", "Dark purple"], 1, "Healthy gums are typically a firm, pale pink color."),
        ("What does it mean if your gums are swollen and bleed easily?", ["You have healthy gums", "You might have gingivitis", "You are brushing too well", "You need a harder toothbrush"], 1, "Swollen, bleeding gums are classic signs of gingivitis, an early stage of gum disease."),
        ("Is gum disease preventable?", ["Yes, with good oral hygiene", "No, it's genetic", "Only with surgery", "Only if you don't eat sugar"], 0, "Good daily oral hygiene is the best way to prevent gum disease."),
        ("What is tartar (calculus)?", ["A type of toothpaste", "Hardened plaque that requires professional removal", "A soft film on teeth", "A type of cavity"], 1, "When plaque isn't removed, it hardens into tartar, which only a dentist can remove."),
        ("Can smoking affect your gum health?", ["No", "Yes, it increases the risk of gum disease", "It makes gums stronger", "Only if you chew tobacco"], 1, "Smoking is a significant risk factor for the development and progression of gum disease.")
    ]
    gum_medium = [
        ("What is the main cause of gingivitis?", ["Eating sugar", "Plaque buildup", "Not drinking enough water", "Brushing too hard"], 1, "Plaque buildup along the gumline irritates the gums, causing gingivitis."),
        ("What is the difference between gingivitis and periodontitis?", ["They are the same thing", "Gingivitis is reversible; periodontitis involves irreversible bone loss", "Periodontitis is milder", "Gingivitis only affects children"], 1, "Gingivitis affects only the gums and is reversible, whereas periodontitis involves the destruction of supporting bone."),
        ("What is a 'periodontal pocket'?", ["A place to store floss", "A space that forms between the gum and tooth due to disease", "The space inside a cavity", "The root of the tooth"], 1, "As gum disease progresses, the gums pull away from the teeth, forming infected pockets."),
        ("Which systemic condition is strongly linked to severe gum disease?", ["Asthma", "Diabetes", "Color blindness", "Arthritis"], 1, "There is a strong two-way relationship between diabetes and periodontal disease."),
        ("How does a dentist measure gum health?", ["By looking at the color of teeth", "By measuring the depth of periodontal pockets with a probe", "By taking a blood test", "By weighing the patient"], 1, "A periodontal probe is used to measure the depth of the space between the tooth and gum.")
    ]
    gum_advanced = [
        ("What happens to the alveolar bone during periodontitis?", ["It gets stronger", "It resorbs (breaks down)", "It turns into enamel", "It grows taller"], 1, "The chronic inflammation of periodontitis causes the body to resorb the supporting alveolar bone."),
        ("Which inflammatory mediators are primarily responsible for bone destruction in periodontitis?", ["Insulin and glucagon", "Cytokines and prostaglandins", "Serotonin and dopamine", "Hemoglobin"], 1, "The immune system releases cytokines (like IL-1) and prostaglandins (like PGE2) which stimulate osteoclasts to break down bone."),
        ("What is 'gingival recession'?", ["When the gums grow over the teeth", "When the gum tissue pulls back, exposing the tooth root", "A type of mouthwash", "When teeth fall out"], 1, "Recession exposes the root surface, which is softer and more prone to decay and sensitivity."),
        ("Can periodontal disease affect pregnancy?", ["No", "Yes, it is linked to premature birth and low birth weight", "It only affects the mother's teeth", "It makes the baby's teeth stronger"], 1, "Research suggests a link between periodontal infection and adverse pregnancy outcomes."),
        ("What is the role of calculus in periodontal disease?", ["It directly infects the gums", "It provides a rough surface for more plaque to accumulate", "It prevents cavities", "It dissolves bone"], 1, "Calculus itself is inert, but its rough surface harbors live bacteria (plaque) against the gums.")
    ]

    # Diet & Sugar
    diet_basic = [
        ("What is the worst type of food for your teeth?", ["Vegetables", "Sticky, sugary candies", "Cheese", "Meat"], 1, "Sticky candies stay on the teeth longer, providing a continuous food source for bacteria."),
        ("Which drink is most likely to cause cavities?", ["Water", "Milk", "Sugary soda", "Unsweetened tea"], 2, "Soda contains high amounts of sugar and is also highly acidic."),
        ("Is it better to sip a sugary drink all day or drink it quickly?", ["Sip it all day", "Drink it quickly with a meal", "Doesn't matter", "Sip it over several hours"], 1, "Drinking it quickly reduces the amount of time your teeth are exposed to acid attacks."),
        ("Which of these foods is actually good for your teeth?", ["Cookies", "Cheese", "Potato chips", "Dried fruit"], 1, "Cheese stimulates saliva and provides calcium and phosphate to remineralize teeth."),
        ("Why is drinking water good for your oral health?", ["It contains sugar", "It helps wash away food particles and dilutes acid", "It stains teeth", "It replaces brushing"], 1, "Water helps clean the mouth and keeps you hydrated, which promotes saliva production.")
    ]
    diet_medium = [
        ("How do bacteria in your mouth use sugar?", ["They turn it into energy and produce acid as a byproduct", "They turn it into enamel", "They die when they eat sugar", "They ignore it"], 0, "Bacteria metabolize sugar and excrete acid, which demineralizes the tooth enamel."),
        ("What is 'demineralization'?", ["Adding minerals to teeth", "The loss of minerals from tooth enamel due to acid", "Whitening teeth", "A type of filling"], 1, "Acid attacks strip minerals like calcium and phosphate from the enamel, weakening it."),
        ("Are 'sugar-free' sodas completely safe for teeth?", ["Yes", "No, they are still acidic and can cause enamel erosion", "Only if they are diet", "Yes, because they have no calories"], 1, "Even without sugar, the high acidity (low pH) of diet sodas can erode enamel over time."),
        ("Why are starchy foods like potato chips bad for teeth?", ["They are hard and break teeth", "They break down into simple sugars and stick to teeth", "They are too salty", "They don't contain vitamins"], 1, "Enzymes in saliva break down starches into sugars, and the sticky texture keeps them on the teeth."),
        ("What effect does frequent snacking have on oral health?", ["It's good for teeth", "It prevents cavities", "It subjects teeth to constant acid attacks", "It increases enamel thickness"], 2, "Frequent snacking doesn't allow saliva enough time to neutralize acids and remineralize the teeth.")
    ]
    diet_advanced = [
        ("What is the 'Stephan Curve'?", ["A type of dental instrument", "A graph showing the drop and recovery of plaque pH after sugar exposure", "The curve of a healthy smile", "A root canal technique"], 1, "The Stephan Curve illustrates how plaque pH drops below the critical level (5.5) after sugar intake and takes time to recover."),
        ("At what pH does tooth enamel begin to demineralize (the critical pH)?", ["7.0", "5.5", "3.0", "8.5"], 1, "When the pH in the mouth drops below approximately 5.5, the enamel begins to dissolve."),
        ("What is the main acid produced by cariogenic bacteria?", ["Hydrochloric acid", "Lactic acid", "Sulfuric acid", "Citric acid"], 1, "Mutans streptococci and lactobacilli primarily produce lactic acid when they ferment sugars."),
        ("How does xylitol help prevent cavities?", ["It kills all bacteria instantly", "Cariogenic bacteria cannot metabolize it, reducing acid production", "It coats the teeth in a protective layer", "It is highly acidic"], 1, "Bacteria ingest xylitol but cannot break it down for energy, which starves them and reduces acid."),
        ("What is the difference between erosion and caries (cavities)?", ["They are the same", "Erosion is chemical loss of tooth structure without bacteria; caries is bacteria-mediated", "Caries only affects the roots", "Erosion is caused by sugar"], 1, "Erosion is caused by direct exposure to dietary or gastric acids, while caries is caused by bacterial acid.")
    ]

    # Dental Visits
    visit_basic = [
        ("How often should you visit the dentist for a routine checkup?", ["Every 5 years", "Once a year", "Every 6 months", "Only when in pain"], 2, "A checkup every 6 months helps catch problems early before they become painful or expensive."),
        ("What does a dental hygienist do during a cleaning?", ["Fills cavities", "Extracts teeth", "Removes plaque and tartar", "Does root canals"], 2, "Hygienists perform professional cleanings to remove hardened tartar that brushing can't."),
        ("Why does the dentist take X-rays?", ["To check your bone density only", "To see cavities between teeth and problems below the gums", "To make your teeth glow", "To whiten your teeth"], 1, "X-rays reveal issues hidden between teeth, under the gums, or within the bone."),
        ("What is a cavity filling?", ["A procedure to remove a tooth", "A procedure to clean out decay and seal the hole", "A type of mouthwash", "A cosmetic whitening procedure"], 1, "The dentist removes the decayed portion of the tooth and fills the space to restore its function."),
        ("Is it normal to feel anxious about visiting the dentist?", ["No, it's very rare", "Yes, dental anxiety is common and you should tell your dentist", "Only for children", "It means you have a cavity"], 1, "Dental anxiety is very common. Dentists have many ways to help you feel comfortable.")
    ]
    visit_medium = [
        ("What is an 'explorer' used for during an exam?", ["To look in your ears", "To gently probe teeth to find soft spots indicating decay", "To clean the teeth", "To extract teeth"], 1, "The explorer is a small metal instrument used to detect cavities by feeling for soft areas in the enamel."),
        ("What is a dental sealant?", ["A type of filling", "A protective plastic coating applied to the chewing surfaces of back teeth", "A mouthguard", "A type of toothpaste"], 1, "Sealants fill in the deep grooves of molars to prevent food and bacteria from getting stuck and causing cavities."),
        ("When might a dentist recommend a root canal?", ["When you have a small cavity", "When the nerve of the tooth is infected or dead", "To whiten a tooth", "To straighten teeth"], 1, "A root canal is necessary when the pulp (nerve) inside the tooth becomes infected, usually due to deep decay."),
        ("What is the difference between a crown and a filling?", ["A crown covers the entire visible tooth; a filling just fills a small hole", "A crown is for front teeth only", "A filling is stronger", "They are the exact same thing"], 0, "A crown is a 'cap' used when a tooth is too damaged or weak to be restored with a simple filling."),
        ("What does the application of topical fluoride at the dentist do?", ["Provides a concentrated dose to strengthen enamel and reverse early decay", "Whitens teeth instantly", "Numbs the gums", "Removes tartar"], 0, "Professional fluoride treatments provide a higher concentration than toothpaste to provide extra protection.")
    ]
    visit_advanced = [
        ("What is a 'panoramic radiograph'?", ["An X-ray of a single tooth", "A 2D dental X-ray that captures the entire mouth in a single image", "A 3D scan of the jaw", "A photograph of your smile"], 1, "It provides a broad overview of the jaws, teeth, sinuses, and TMJ."),
        ("What is the purpose of 'scaling and root planing'?", ["To whiten teeth", "To deeply clean above and below the gumline to treat periodontal disease", "To prepare a tooth for a crown", "To align teeth"], 1, "Often called a 'deep cleaning', it removes tartar from deep pockets and smooths the roots to help gums reattach."),
        ("What material is commonly used for modern tooth-colored fillings?", ["Amalgam", "Gold", "Composite resin", "Porcelain"], 2, "Composite resin is a durable, tooth-colored material used for aesthetic restorations."),
        ("What is an 'apicoectomy'?", ["A routine cleaning", "A surgical procedure to remove the tip of a tooth's root", "A type of braces", "A gum graft"], 1, "It's an endodontic surgery performed when an infection persists after a standard root canal treatment."),
        ("What does a periodontist specialize in?", ["Braces", "Root canals", "The prevention, diagnosis, and treatment of periodontal (gum) disease", "Extracting wisdom teeth"], 2, "Periodontists are specialists in the supporting structures of the teeth (gums and bone).")
    ]

    # Oral Hygiene Knowledge
    know_basic = [
        ("What is the hard outer layer of the tooth called?", ["Dentin", "Pulp", "Enamel", "Root"], 2, "Enamel is the hardest substance in the human body and protects the inner layers of the tooth."),
        ("What is the soft center of the tooth containing nerves and blood vessels?", ["Enamel", "Pulp", "Cementum", "Crown"], 1, "The pulp is the living tissue in the center of the tooth."),
        ("How many primary (baby) teeth do children usually have?", ["10", "20", "32", "24"], 1, "Children typically have 20 primary teeth, which are eventually replaced by 32 permanent teeth."),
        ("What is the purpose of a mouthguard?", ["To straighten teeth", "To protect teeth from injury during sports or from grinding", "To whiten teeth overnight", "To freshen breath"], 1, "Mouthguards absorb shock to protect teeth from trauma or the wear and tear of grinding (bruxism)."),
        ("Should you share a toothbrush with someone else?", ["Yes, it's fine", "Only with family", "No, it spreads bacteria and increases the risk of infection", "Yes, to save money"], 2, "Sharing toothbrushes can transmit bacteria, viruses, and even blood-borne diseases.")
    ]
    know_medium = [
        ("What is the layer of tooth directly beneath the enamel?", ["Pulp", "Cementum", "Dentin", "Bone"], 2, "Dentin is a porous, yellowish tissue that makes up the bulk of the tooth structure beneath the enamel."),
        ("What causes tooth sensitivity to hot or cold?", ["Too much saliva", "Exposed dentin due to worn enamel or receding gums", "A healthy diet", "Using a soft toothbrush"], 1, "When dentin is exposed, temperature changes can reach the nerve inside the tooth, causing pain."),
        ("What is 'bruxism'?", ["A type of cavity", "The medical term for teeth grinding or clenching", "A type of mouthwash", "A gum infection"], 1, "Bruxism often happens during sleep and can lead to severe tooth wear and jaw pain."),
        ("Why is dry mouth (xerostomia) a risk factor for cavities?", ["It makes teeth too wet", "Lack of saliva means less neutralization of acids and less washing away of food", "It increases enamel strength", "It changes tooth color"], 1, "Saliva is essential for maintaining a healthy pH and remineralizing teeth."),
        ("What are 'wisdom teeth'?", ["The front teeth", "The third molars that typically erupt in the late teens or early twenties", "Teeth that never fall out", "Artificial teeth"], 1, "Wisdom teeth are the last teeth to emerge, and they often need extraction due to lack of space.")
    ]
    know_advanced = [
        ("What is the function of the cementum?", ["To protect the crown", "To cover the root surface and provide attachment for the periodontal ligament", "To produce saliva", "To detect temperature"], 1, "Cementum is a bone-like tissue covering the root, anchoring the tooth to the jawbone via ligament fibers."),
        ("What is the 'periodontal ligament' (PDL)?", ["A nerve inside the tooth", "A group of connective tissue fibers that attach the tooth to the alveolar bone", "A muscle in the jaw", "A type of filling"], 1, "The PDL acts as a shock absorber and securely holds the tooth in its socket."),
        ("What causes 'fluorosis'?", ["Not brushing enough", "Excessive fluoride ingestion during tooth development", "Eating too much sugar", "Grinding teeth"], 1, "Fluorosis occurs when a child consumes too much fluoride while their permanent teeth are forming, leading to white spots or mottling."),
        ("What is 'Sjogren's syndrome' and how does it relate to oral health?", ["A muscle disease", "An autoimmune disease that causes severe dry mouth (xerostomia)", "A type of oral cancer", "A genetic defect in enamel"], 1, "Sjogren's attacks the salivary glands, leading to dry mouth and a significantly higher risk of rampant decay."),
        ("What is the hydrodynamic theory of dentinal hypersensitivity?", ["Water pressure causes pain", "Fluid movement within dentinal tubules stimulates nerve endings in the pulp", "Air causes teeth to dry out", "Blood flows into the enamel"], 1, "When dentin is exposed, stimuli (cold, air) cause the fluid in microscopic tubules to shift, triggering a pain response.")
    ]

    all_data = [
        (brushing_basic, "Brushing Habits", "Basic"),
        (brushing_medium, "Brushing Habits", "Medium"),
        (brushing_advanced, "Brushing Habits", "Advanced"),
        (flossing_basic, "Flossing Habits", "Basic"),
        (flossing_medium, "Flossing Habits", "Medium"),
        (flossing_advanced, "Flossing Habits", "Advanced"),
        (gum_basic, "Gum Health", "Basic"),
        (gum_medium, "Gum Health", "Medium"),
        (gum_advanced, "Gum Health", "Advanced"),
        (diet_basic, "Diet & Sugar Consumption", "Basic"),
        (diet_medium, "Diet & Sugar Consumption", "Medium"),
        (diet_advanced, "Diet & Sugar Consumption", "Advanced"),
        (visit_basic, "Dental Visits", "Basic"),
        (visit_medium, "Dental Visits", "Medium"),
        (visit_advanced, "Dental Visits", "Advanced"),
        (know_basic, "Oral Hygiene Knowledge", "Basic"),
        (know_medium, "Oral Hygiene Knowledge", "Medium"),
        (know_advanced, "Oral Hygiene Knowledge", "Advanced"),
    ]

    count = 0
    for data_set, cat, diff in all_data:
        for q_text, options, correct_idx, expl in data_set:
            q = models.QuestionBank(
                category=cat,
                difficulty=diff,
                question_text=q_text,
                options=options,
                correct_option_index=correct_idx,
                explanation=expl,
                educational_tip=expl  # Simplify for now by using explanation as the tip
            )
            db.add(q)
            count += 1
            
    db.commit()
    print(f"Seeded {count} highly detailed dental assessment questions.")
    db.close()

if __name__ == "__main__":
    seed_questions()
