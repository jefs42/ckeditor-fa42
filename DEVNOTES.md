# Notes for future additions, adjustments

## Advanced Tab

At minimum, a field to allow user to enter custom FA-related CSS styling:

- --fa-primary-opacity

- --fa-secondary-opacity

- --fa-primary-color

- --fa-secondary-color

- --fa-rotate-angle

- --fa-animation-timing

- --fa-animation-delay

- etc



Possibly with toggle boxes to, i.e.:

Class: fa-rotate-by

Style: --fa-rotate-angle: 47deg

# How far to go?

A lot can be done with FA. But how much can be put into an "easy-to-use" dialog?

For example rotate and flip can't really be used directly on a single tag, one class will override the transformation settings of the other. It's still possible, code-wise, but with additional markup:

```html
<span class="fa-rotate-90">
    <i class="fa-icon fa-flip-horizontal"></i>
</span>
```

This may be *too* avanced usage to try to put into what should be a fairly simple to use dialog...
