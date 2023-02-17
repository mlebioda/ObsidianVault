## Zmiany
https://www.fluentcpp.com/2021/12/13/the-evolutions-of-lambdas-in-c14-c17-and-c20/
1. C++ 14
	- default parameters
		 auto myLambda = [](int x, int y = 0){ std::cout << x << '-' << y << '\n'; };
		  std::cout << myLambda(1, 2) << '\n';
		  std::cout << myLambda(1) << '\n';
	- template parameters
		 It means that in c++ 11 type the parameters must be specified
		 In c++ 14 auto can be used
		 ![[Pasted image 20230125141012.png]]
	- generalized capture
		 C++ 11 lambdas can only capture existing objects in their scope
		 C++ 14 ![[Pasted image 20230125141330.png]]
	- returning lambda from a function
		 just use auto in a return type - then you can retur lambda like a function pointer
	- Dać przykład std::Move w generalized 
1. C++ 17
	1. Capturing a copy of *this
	    ![[Pasted image 20230126110255.png]]
	     Following example gets copy of this which is the pointer. This can lead to memory leaks if lambda outlives the object
                 auto lambda = MyType{42}.getLambda();
	         lambda();
	     C++17 provides a solution to this issue.
	     ![[Pasted image 20230126110715.png]]
	     Following syntax [*this] Creates a copy of whole object

		It was possible in C++14     return [self = *this](){ return self.m_value; };
	    
	1. Lambdas can be declared constexpr
		   constexpr auto times2 = [] (int n) { return n * 2; };
	   such Lambdas can be evaluated at compile time (useful in template programming)
	    static_assert(times2(3) == 6);
	    In 17 syntax is nicer
3. C++ 20
	1. Templates - syntax is even closer to manual defined functions
	   ![[Pasted image 20230126111234.png]]
	   It makes easier to access the template parameter type than c++14 template lambdas thad used expressions such as auto&&
	  2. Lambda is able to capture a variadic pack of parameters
	     ![[Pasted image 20230126111442.png]]

## CASE OF USE
many stl algorithms - functors

## FUNCTORS VS LAMBDA
Labda dla trywialnych przypadków, a functor dla bardziej rozbudowanych ponieważ przy tych drugich gubi enkapsulacje. Więc ktoś kto czyta kod musi się wczytać co robi kod zamiast przeczytać nazwę, która określa co on robi.

Da się zrobić abstrakcję w przypadku lambdy od c++14
auto abstractObject(const Object &object){
 return \[object\] (const Object2 & object2){ return something;}
}

!!! If you use auto to lambda, lambda is implicitly coinverted to this std::Function.

## EXAMPLES




## TODO
https://www.fluentcpp.com/2020/06/05/out-of-line-lambdas/ 
https://www.fluentcpp.com/2017/01/19/making-code-expressive-lambdas/