import { motion } from 'framer-motion';
import './about.scss';

const About = () => {
  return (
    <div className="about-us">
      <motion.div
        className="hero"
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1>Welcome to Our World</h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Where Creativity Meets Innovation
        </motion.p>
      </motion.div>

      <motion.div
        className="section"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2>Our Mission</h2>
        <p>
          To transform ideas into groundbreaking solutions that make the world a better place. 
        </p>
      </motion.div>

      <motion.div
        className="section"
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <h2>Our Vision</h2>
        <p>
          To be the leading innovators in our field, constantly pushing the boundaries of what's possible.
        </p>
      </motion.div>

      <motion.div
        className="section"
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <h2>Meet Our Team</h2>
        <div className="team">
          <motion.div
            className="team-member"
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <img src="/rizwan.jpg" alt="Team Member 1" />
            <h3>Rizwan Kabir</h3>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
       
      </motion.div>
    </div>
  );
};

export default About;
