from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse


def user_view(request):
    if request.method == 'GET':
        return HttpResponse("Hello World from GET request")
    elif request.method == 'POST':
        return HttpResponse("Received POST request")
    else:
        return HttpResponse("HTTP method not supported", status=405)
