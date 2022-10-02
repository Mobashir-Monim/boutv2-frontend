import { Link } from "react-router-dom";
import { pageLayoutStyles, borderColorStyles, textColorStyles, transitioner } from "../../utils/styles/styles";

const TermsOfService = () => {
    return <div className={`${pageLayoutStyles.scrollable}`}>
        <div className="w-[100%] md:w-[80%] lg:w-[70%] mx-auto">
            <h1 className={`text-[2rem] mt-10 mb-3 border-b-2 ${borderColorStyles.simple}`}>Website Terms and Conditions of Use</h1>

            <h2 className={`text-[1.5rem] mt-10 mb-3 border-b-2 ${borderColorStyles.simple}`}>1. Terms</h2>
            <p className={`text-justify my-2`}>By accessing this Website, accessible from bout.eveneer.xyz, you are agreeing to be bound by these Website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws. If you disagree with any of these terms, you are prohibited from accessing this site. The materials contained in this Website are protected by copyright and trade mark law.</p>

            <hr />

            <h2 className={`text-[1.5rem] mt-10 mb-3 border-b-2 ${borderColorStyles.simple}`}>2. Use License</h2>
            <p className={`text-justify my-2`}>Permission is granted to temporarily download one copy of the materials on BracU (CSE) Online Utility Tool's Website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
            <ul className="ml-5 flex flex-col gap-2">
                <li className="text-justify border-b-[1px]">modify or copy the materials;</li>
                <li className="text-justify border-b-[1px]">use the materials for any commercial purpose or for any public display;</li>
                <li className="text-justify border-b-[1px]">attempt to reverse engineer any software contained on BracU (CSE) Online Utility Tool's Website;</li>
                <li className="text-justify border-b-[1px]">remove any copyright or other proprietary notations from the materials; or</li>
                <li className="text-justify border-b-[1px]">transferring the materials to another person or "mirror" the materials on any other server.</li>
            </ul>
            <p className={`text-justify my-2`}>This will let BracU (CSE) Online Utility Tool to terminate upon violations of any of these restrictions. Upon termination, your viewing right will also be terminated and you should destroy any downloaded materials in your possession whether it is printed or electronic format. These Terms of Service has been created with the help of the <a href="https://www.termsofservicegenerator.net">Terms Of Service Generator</a>.</p>

            <hr />

            <h2 className={`text-[1.5rem] mt-10 mb-3 border-b-2 ${borderColorStyles.simple}`}>3. Disclaimer</h2>
            <p className={`text-justify my-2`}>All the materials on BracU (CSE) Online Utility Tool’s Website are provided "as is". BracU (CSE) Online Utility Tool makes no warranties, may it be expressed or implied, therefore negates all other warranties. Furthermore, BracU (CSE) Online Utility Tool does not make any representations concerning the accuracy or reliability of the use of the materials on its Website or otherwise relating to such materials or any sites linked to this Website.</p>

            <hr />

            <h2 className={`text-[1.5rem] mt-10 mb-3 border-b-2 ${borderColorStyles.simple}`}>4. Limitations</h2>
            <p className={`text-justify my-2`}>BracU (CSE) Online Utility Tool or its suppliers will not be hold accountable for any damages that will arise with the use or inability to use the materials on BracU (CSE) Online Utility Tool’s Website, even if BracU (CSE) Online Utility Tool or an authorize representative of this Website has been notified, orally or written, of the possibility of such damage. Some jurisdiction does not allow limitations on implied warranties or limitations of liability for incidental damages, these limitations may not apply to you.</p>

            <hr />

            <h2 className={`text-[1.5rem] mt-10 mb-3 border-b-2 ${borderColorStyles.simple}`}>5. Revisions and Errata</h2>
            <p className={`text-justify my-2`}>The materials appearing on BracU (CSE) Online Utility Tool’s Website may include technical, typographical, or photographic errors. BracU (CSE) Online Utility Tool will not promise that any of the materials in this Website are accurate, complete, or current. BracU (CSE) Online Utility Tool may change the materials contained on its Website at any time without notice. BracU (CSE) Online Utility Tool does not make any commitment to update the materials.</p>

            <h2 className={`text-[1.5rem] mt-10 mb-3 border-b-2 ${borderColorStyles.simple}`}>6. Links</h2>
            <p className={`text-justify my-2`}>BracU (CSE) Online Utility Tool has not reviewed all of the sites linked to its Website and is not responsible for the contents of any such linked site. The presence of any link does not imply endorsement by BracU (CSE) Online Utility Tool of the site. The use of any linked website is at the user’s own risk.</p>

            <hr />

            <h2 className={`text-[1.5rem] mt-10 mb-3 border-b-2 ${borderColorStyles.simple}`}>7. Site Terms of Use Modifications</h2>
            <p className={`text-justify my-2`}>BracU (CSE) Online Utility Tool may revise these Terms of Use for its Website at any time without prior notice. By using this Website, you are agreeing to be bound by the current version of these Terms and Conditions of Use.</p>

            <hr />

            <h2 className={`text-[1.5rem] mt-10 mb-3 border-b-2 ${borderColorStyles.simple}`}>8. Your Privacy</h2>
            <p className={`text-justify my-2`}>Please read our <Link to="/privacy-policy" className={`${textColorStyles.clickable} ${transitioner.simple}`} target="_blank">Privacy Policy</Link>.</p>

            <hr />

            <h2 className={`text-[1.5rem] mt-10 mb-3 border-b-2 ${borderColorStyles.simple}`}>9. Governing Law</h2>
            <p className={`text-justify my-2`}>Any claim related to BracU (CSE) Online Utility Tool's Website shall be governed by the laws of Bangladesh without regards to its conflict of law provisions.</p>
        </div>
    </div>
}

export default TermsOfService;