FROM launcher.gcr.io/google/nodejs

COPY . /app/

RUN npm --unsafe-perm install

CMD ["npm","start"]
