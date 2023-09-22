import Notiflix from 'notiflix';

const formRef = document.querySelector('form');

formRef.addEventListener('submit', onCreateHandler);

function onResolve(value) {
  Notiflix.Notify.success(value);
}

function onReject(error) {
  Notiflix.Notify.failure(error);
}

function onCreateHandler(e) {
  e.preventDefault();

  let delay = Number(this.delay.value);
  const step = Number(this.step.value);
  const amount = Number(this.amount.value);

  for (let i = 1; i <= amount; i += 1) {
    createPromise(i, delay).then(onResolve).catch(onReject);
    delay += step;
  }

  e.currentTarget.reset();
}

function createPromise(position, delay) {
  return new Promise((resolve, reject) => {
    const shouldResolve = Math.random() > 0.3;

    setTimeout(() => {
      if (shouldResolve) {
        resolve(`✅ Fulfilled promise ${position} in ${delay}ms`);
      } else reject(`❌ Rejected promise ${position} in ${delay}ms`);
    }, delay);
  });
}
