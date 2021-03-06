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


# Hoisting - var

hosting 이란 변수의 선언만을 해당 스코프의 맨 위로 끌어올린것을 말함.
<pre>
    console.log(x);                             var x;
    var x = 1;              -->                 console.log(x);
    // OUTPUT = undefined;                      x = 1;
</pre>

function도 hositing 대상이다.

__함수의 선언과 값의 초기화는 서로 다르다.__

# Function, lexical scope

코드의 어떤 식별자가 실제로 어떤 값이 가리키는지를 결정하는 것을 binding이라고한다.

자바스크립트에서의 binding은 lexical scope를 통해서만 이뤄짐.

_lexical scope란 안쪽에서 바깥쪽 변수에 접근할 수 있는것._

lexical scope는 밖에서 안을 참조할 수 없음.

> var은 block scoping의 대상이 아니다.

# Closure
> closure  = function + environment

closure은 function이 하나 생길때 마다 하나씩 생긴다.
environment는 함수 자신을 둘러싼, 접근할 수 있는 모든 스코프를 뜻한다.

<pre>
    function and(x) 
    {
        return function print(y)
        {
            return x + 'and' + y;
        }
    }
    const saltand = and('salt');    
    console.log(saltand('pepper')); //OUTPUT : salt and pepper
    console.log(saltand('sugur'));  //OUTPUT : salt and sugar
</pre>

and 함수로 만들어진 saltAnd의 closure는 
- 함수 : print
- 환경 : x -> "salt"
closure는 higher-order function을 만드는데 유용

<pre>
    f : function
    f foo()
    {
        f bar(){}
        f baz(){}
    }
    foo(); -- 1
    foo(); -- 2
</pre>
위 코드에서는 closure이 총 5개 생김

이유는 코드가 실행되면서 foo() 함수의 closure이 하나 생성되고 
1의 foo()가 실행되면서 foo() 함수안의 bar,baz의 closure이 생성되면 총 3개가 되고

2에서 실행이되면 기존의 foo()를 제되한 bar,baz는 새로운 함수로 판단하여 개가 더 생기기 때문.


# let, const

hoisting 규칙이 없고, block scoping을 지원함.

let과 const의 예측 가능성과 유지보수성이 var보다 좋다.
## let
- 레퍼런스가 바뀔 수 있음
- 한번을 넘어서는 선언을 할 수 없음.

## const
- 상수

# Spread syntax (...)
Object 뿐 만 아니라 배열에서도 사용 할 수 있음.


# Promise

revole , reject 중 둘중 하나만 먼저 실행된것중 하나만 실행한다.

스코프 분리가 됨으로써 오류 발생률이 떨어진다. 

# Polyfill

JS standard library에 표준으로 등록되어 있으나, 아직 브라우저나 Node.js에서 구현되지 않은 기능을 미리 써 볼 수 있도록 만들어진 구현체
> core.js

# Stream

> File, Network Input --> Handelr

Stream 은 스트림 가능한 소스로부터 데이터를 작은 청크로 쪼개 처리할 수 있게 한다.

큰데이터를 처리해야하거나, 비동기적으로만 어등ㄹ 수 있는 데이터를 처리해야할 때 유용

## 일반적인 구현 형태
<pre>
    const fs = require('fs')
    const rs = fs.createReadStream('[FILENAME]', [encoding:'utf-8'])

    rs.on('data',data => {
        // Do something with data...
    })

    rs.on('error,error => {
        // Do Error Exception
    })

    rs.on('end', () => {
        // done
    })
</pre>

## Stream 종류

### Readable
> 스르팀으로부터 읽을 수 있음.
- fs.createREadStream
- process.stdin
- _서버입장의_ HTTP 요청
- 클라이언트 입장의 HTTP 응답

### Writeable
> 스트림에 출력 할 수 있음.
- fs.createWriteStream
- process.stdout
- _클라이언트_ 입장의 HTTP 요청
- 서버 입장의 HTTP 응답.

### Duplex
> 스트림에 입력을 받을 수도있고, 출력을 보낼 수도 있음.
- TCP sockets
- zlib streams - 압축 알고리즘 스트림.
- crypto streams - 암호화 알고리즘 스트림.

### Transform
> 입력받은 스트림을 변환해 새로움 스트림으로 만듬.
- zlib streams
- crypto streams