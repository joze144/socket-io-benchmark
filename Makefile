APP=socket-io-benchmark
DOCKER_REGISTRY=jozhe

all: build push-minikube-registry

reload-all: build clean-minikube-registry push-minikube-registry

build :
	docker build --pull -t ${DOCKER_REGISTRY}/${APP}:latest .

clean-minikube-registry:
	minikube image rm ${DOCKER_REGISTRY}/${APP}

push-minikube-registry:
	minikube image load ${DOCKER_REGISTRY}/${APP}:latest
