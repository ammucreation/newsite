document.addEventListener('DOMContentLoaded', function() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      // Toggle active class on clicked question
      question.classList.toggle('active');
      
      // Get the answer element
      const answer = question.nextElementSibling;
      const icon = question.querySelector('i');
      
      // Toggle answer visibility with animation
      if (question.classList.contains('active')) {
        // Expand answer
        answer.style.maxHeight = answer.scrollHeight + 'px';
        answer.style.opacity = '1';
        answer.style.padding = '1rem 0';
        icon.style.transform = 'rotate(180deg)';
      } else {
        // Collapse answer
        answer.style.maxHeight = '0';
        answer.style.opacity = '0';
        answer.style.padding = '0';
        icon.style.transform = 'rotate(0deg)';
      }
      
      // Close other open FAQs
      faqQuestions.forEach(otherQuestion => {
        if (otherQuestion !== question && otherQuestion.classList.contains('active')) {
          otherQuestion.classList.remove('active');
          const otherAnswer = otherQuestion.nextElementSibling;
          const otherIcon = otherQuestion.querySelector('i');
          otherAnswer.style.maxHeight = '0';
          otherAnswer.style.opacity = '0';
          otherAnswer.style.padding = '0';
          otherIcon.style.transform = 'rotate(0deg)';
        }
      });
    });
  });
});