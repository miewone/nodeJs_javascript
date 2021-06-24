이벤트 루프 모델은 여러스레드를 사용.


# Run-to-completion
이벤트 루프가 다음 콜백을 처리하려면 지금 처리하고 있는 콜백의 실행이 완전히 끝나야한다.
call stack이 완전히 빌 때까지 처리한다는 것과 동일.

# Callback Queue
콜백들이 쌓이는 큐
콜백 큐는 앞으로 실행할 콕백들을 쌓아두는 큐.

콜백은 브라우저나 node가 어떤 일이 발생하면 메인 스레드에 이를 알려주기 위해 사용된다.

이벤트는 파일 처리의 완료, 네트워크 작업의 완료, 타이머의 호출 등이 있다.

# non-blocking I/O & offloading
<pre>
    // 여기서 Node에게 파일을 읽어달라고 요청하고, 워커 스레드에서 파일을 읽기 시작함.
    fs.readFile(fileName, (err,data) => {
            // Node가 파일을 다 읽고 나면
            // 1. callback queue에 이 함수에 err,data 인자를 채워서 넣고
            // 2. callback queue에서 꺼내질 때 이 부분이 실행 됨.
    });

    // readFile의 호출이 끝난 직후 바로 이 함수를 실행하게 된다.
    // 이는 여전히 같은 콜백을 처리하는 중이기 때문.
    someTask();
</pre>
브라우저나 Node.js에서 ,Web API 혹은 Node API의 동작이 끝나면 callback queue에 등록한다.

브라우저나 Node가 요청 받은 일을 하고 있는 동안 메인 스레드와 이벤트 루프는 영향을 받지 않고 계속 실행된다.
이를 __offloading 이라고하며 ,Node 서버의 메인 스레드가 하나임에도 불구하고 빠르게 동작할 수 있는 이유.__


