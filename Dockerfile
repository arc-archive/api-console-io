FROM launcher.gcr.io/google/nodejs

RUN install_node v16.14.0 --ignore-verification-failure

COPY . /app/

RUN npm --unsafe-perm install

CMD ["npm","start"]
